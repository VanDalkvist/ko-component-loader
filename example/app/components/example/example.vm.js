define(['knockout'], function (ko) {

    function HelloVm() {
        this.example = ko.observable('example');
    }

    return HelloVm;

});