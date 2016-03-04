define([
    'knockout', 'require', 'path-provider.factory', 'components.settings'
], function (ko, require, pathProviderFactory, componentsSettings) {

    // setup
    var koOriginalComponentsGet = ko.components.get;

    // config
    var keys = ['app', 'vm', 'factory', 'componentsFolder'];
    var defaults = {'app': 'app', 'componentsFolder': 'components'};

    // builder config
    var loaderBuilder = {
        buildComponentLoader: function _buildComponentLoader() {
            ko.components.get = _getComponent;

            var pathProvider = pathProviderFactory.buildProvider(componentsSettings.formats);

            return {
                appName: defaults.app,
                componentsFolder: defaults.componentsFolder,
                pathProvider: pathProvider,
                usePathProvider: function (pathProvider) {
                    var loader = this;
                    loader.pathProvider = pathProvider;
                },
                /**
                 * Create config to build component using view-model or factory
                 * @param nameConfig {string/object} if string - just use default component provider by name.
                 *   Otherwise checks arguments to containing configuration like {
                 *     app: {string}, - app name to get component from this name
                 *     vm: {string}, - use if you have a view model for your component
                 *     factory: {string}, - use if you have a factory for your component,
                 *     componentsFolder: {string} - folder where to find components, default is 'components'
                 *   }
                 * @param callback - standard knockout callback to operate with component config
                 */
                getConfig: _getConfig,
                loadViewModel: _loadViewModel
            };
        }
    };

    return loaderBuilder;

    function _getComponent(componentName, callback) {
        var name = componentName;
        if (typeof componentName == 'object'
            || Object.prototype.toString.call(componentName) == '[object Object]') {
            // need to serialize name if it's an object due to components caching by name
            name = _buildComponentName(keys, defaults, componentName);
        }

        return koOriginalComponentsGet(name, callback);
    }

    function _buildComponentName(keys, defaults, componentName) {
        var res = '';
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!componentName.hasOwnProperty(key)/* && !defaults.hasOwnProperty(key)*/) continue;

            var value = componentName[key];

            //var defaultValue = defaults[key];
            //if (!value && !!defaultValue) {
            //    value = defaultValue;
            //}

            if (!value) continue;

            res += key + '=' + value + ':';
        }

        return res.slice(0, res.length - 1);
    }

    function _getConfig(componentName, callback) {
        var loader = this;

        if (!_isString(componentName)) return callback(null);

        var nameConfig = {};
        if (!_tryBuildNameConfig(componentName, nameConfig)) return callback(null);

        if (!nameConfig.app && !loader.appName) {
            console.warn(
                "You didn't provide app name as 'app' argument of name. "
                + "Use component loader 'appName' config or set it to your component as 'app' argument of component 'name'. Now it will be set to empty string.");
        }

        nameConfig.app = (nameConfig.app ? nameConfig.app : loader.appName) || '';

        if (!nameConfig.vm && !nameConfig.factory) {
            throw new Error(
                "You didn't provide neither 'vm' or 'factory' name. "
                + "Cannot resolve component with name config '" + JSON.stringify(nameConfig) + "'. "
                + "Use one of 'vm' or 'factory' arguments to provide view-model or factory name accordingly.");
        }

        if (!!nameConfig.vm && !!nameConfig.factory) {
            throw new Error(
                "You cannot use both of 'vm' and 'factory' arguments. Use one of them."
                + "Cannot resolve component with name config '" + JSON.stringify(nameConfig) + "'.");
        }

        var componentsFolder = nameConfig.componentsFolder ? nameConfig.componentsFolder : loader.componentsFolder;
        var formatMap = {app: nameConfig.app, vm: nameConfig.vm, components: componentsFolder};

        var config = {viewModel: {require: ''}, template: {require: ''}};

        var pathProvider = loader.pathProvider;

        if (nameConfig.vm) {
            config.viewModel.require = pathProvider.vm(formatMap);
            formatMap.template = formatMap.vm;
            config.template.require = pathProvider.template(formatMap);
            return callback(config);
        }

        // build using factory
        formatMap.template = formatMap.factory = nameConfig.factory;

        config.template.require = pathProvider.template(formatMap);

        require([pathProvider.factory(formatMap)], function (factory) {
            config.viewModel = {useFactory: true, factory: factory};
            callback(config);
        });
    }

    function _loadViewModel(name, viewModelConfig, callback) {
        if (viewModelConfig.useFactory !== true) return callback(null);

        callback(viewModelConfig.factory);
    }

    function _isString(obj) {
        return typeof obj == 'string'
            || Object.prototype.toString.call(obj) == '[object String]';
    }

    function _tryBuildNameConfig(name, nameConfig) {
        var componentNameParts = name.split(':');

        for (var i = 0; i < componentNameParts.length; i++) {
            var namePart = componentNameParts[i];
            var keyValuePairs = namePart.split('=');
            if (keyValuePairs.length === 1) return false;

            var key = keyValuePairs[0];
            var value = keyValuePairs[1];
            nameConfig[key] = value;
        }
        return true;
    }

});