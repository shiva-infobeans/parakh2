/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * lazy module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', , 'ojs/ojtabs', 'ojs/ojconveyorbelt'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function lazyContentViewModel(person) {
        var self = this;
        // for the Buttonset:
        self.types = ko.observable();

        // for value option
        self.textValue = ko.observable('info');
        var summary = "Info Summary Text";
        var detail = "Info Detail Text";
        var type = "info";
        // for messagesCustom option
        self.appMessages = ko.observableArray([{summary: summary, detail: detail, severity: type}]);


        oj.Components.setDefaultOptions({
            'editableValue':
                    {
                        'displayOptions':
                                {
                                    'messages': ['notewindow']
                                }
                    }});


    }

    return lazyContentViewModel;
});
