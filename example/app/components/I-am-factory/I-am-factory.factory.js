define(['knockout'], function (ko) {

    function factory() {
        return {
            name: ko.observable('World')
        };
    }

    return factory;

});