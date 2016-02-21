require([
    'ko', 'component.loader', 'path-provider.factory', 'components.settings'
], function (ko, componentLoader, pathProviderFactory, componentSettings) {

    componentLoader.appName = 'example-app';

    var provider = pathProviderFactory.buildProvider(componentSettings.formats);

    componentLoader.usePathProvider(provider);

    ko.components.loaders.unshift(componentLoader);

    var vm = {hello: 'world!'};

    ko.applyBindings(vm, document.getElementById('example-app-id'));
});