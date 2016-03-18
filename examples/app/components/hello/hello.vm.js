define(['knockout'], function (ko) {

    function HelloVm() {
        this.hello = ko.observable('hello');
    }

    return HelloVm;

});