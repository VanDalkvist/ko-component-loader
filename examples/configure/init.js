require([
    'knockout', 'component-loader.factory'
], function (ko, componentLoaderFactory) {

    var componentLoader = componentLoaderFactory.buildComponentLoader();

    componentLoader.appName = 'example-app';

    ko.components.loaders.unshift(componentLoader);

    var vm = {hello: 'world!'};

    ko.applyBindings(vm, document.getElementById('example-app-id'));
});