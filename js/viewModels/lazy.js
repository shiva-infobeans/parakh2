/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * lazy module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojtabs', 'ojs/ojconveyorbelt'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    
    function lazyContentViewModel(person) {
        var self = this;
        var summary = "Info Summary Text";
        var detail = "Info Detail Text";
        var type= "info";
        
        // for the Buttonset:
        self.types = ko.observableArray(['info']);

        // for value option
        self.textAreaValue = ko.observable('info');
        self.radiosetValue = ko.observable('info');
        self.numberValue = ko.observable(0);
        
        self.selectValue = ko.observable(['info']);
        self.comboboxValue = ko.observable(['info']);
        self.comboboxMultiValue = ko.observable(['info']);
        self.inputSearchValue = ko.observable(['info']);
        self.checkboxsetValue = ko.observable(['info']);
       
        self.switchValue = ko.observable(true);

        
        self.msgs = ko.observableArray();
        self.msgs.push({summary: summary, detail: detail, severity: type});
        self.appMessages = ko.observableArray();
        self.appMessages(self.msgs());
        self.textValue = ko.observable("SSS");
        self.types.subscribe(self._update);

    }

    return lazyContentViewModel;
});
