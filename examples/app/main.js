(function () {

    requirejs.config({
        baseUrl: "app/",
        paths: {
            'knockout': "/vendors/knockout/dist/knockout.debug",
            'jquery': '/vendors/jquery/dist/jquery',
            'text': '/vendors/text/text',
            'loader': '/vendors/ko-component-loader/dist/component-loader'
        },
        shim: {
            'knockout': ['jquery']
        }
    });

    // private functions

    require(['loader'], function () {
        require([
            'knockout',
            'component-loader.factory'
        ], function (ko, componentLoaderFactory) {

            var componentLoader = componentLoaderFactory.buildComponentLoader();

            componentLoader.appName = '/src';

            ko.components.loaders.unshift(componentLoader);

            var vm = {hello: 'world!'};

            ko.applyBindings(vm, document.getElementById('example-app-id'));
        });
    });

}());