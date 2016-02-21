define(['require'], function (require) {

    var namingConventionLoader = {
        appName: '',
        componentsFolder: 'components',
        usePathProvider: function (pathProvider) {
            this.pathProvider = pathProvider;
        },
        /**
         * Create config to build component using view-model or factory
         * @param nameConfig {string/object} if string - just use default component provider by name.
         * Otherwise checks arguments to containing configuration like {
     *  app: {string}, - app name to get component from this name
     *  vm: {string}, - use if you have a view model for your component
     *  factory: {string}, - use if you have a factory for your component,
     *  componentsFolder: {string} - folder where to find components, default is 'components'
     * }
         * @param callback - standard knockout callback to operate with component config
         */
        getConfig: _getConfig,
        loadViewModel: _loadViewModel
    };

    return namingConventionLoader;

    function _getConfig(nameConfig, callback) {
        var loader = this;

        if (_isString(nameConfig)) return callback(null);

        if (!nameConfig.app && !loader.appName) {
            throw new Error(
                "You didn't provide app name as 'app' argument of name. "
                + "Cannot resolve component with name config '" + JSON.stringify(nameConfig) + "'. "
                + "Use component loader 'appName' config or set it to your component as 'app' argument of component 'name'.");
        }

        nameConfig.app = nameConfig.app ? nameConfig.app : loader.appName;

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

        if (nameConfig.vm) {
            config.viewModel.require = loader.pathProvider.vm(formatMap);
            config.template.require = loader.pathProvider.template(nameConfig.vm);
            return callback(config);
        }

        // build using factory
        formatMap.factory = nameConfig.factory;
        var factoryPath = loader.pathProvider.factory(formatMap);

        formatMap.template = nameConfig.factory;
        config.template.require = loader.pathProvider.template(formatMap);

        require([factoryPath], function (factory) {
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

});