/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * lazy module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton',
    'ojs/ojselectcombobox', 'ojs/ojdatetimepicker', 'ojs/ojradioset', 'ojs/ojcheckboxset',
    'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdialog', 'ojs/ojknockout-validation', 'ojs/ojswitch'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function lazyContentViewModel(person) {
        var self = this;
        self.tracker = ko.observable();
        
        // for the 'value' option
        self.textValue = ko.observable('');
        self.textAreaValue = ko.observable('');
        

        self.selectValue = ko.observable(null);
        self.comboboxValue = ko.observable([]);
        self.comboboxMultiValue = ko.observable([]);
        self.inputSearchValue = ko.observable([]);
        // for 'messagesCustom' option
        self.msgsCustomArray = ko.observableArray();
        var summary = "Info Summary Text";
        var detail = "Info Detail Text";
        var severity = "info";
        var msgs = [];
        msgs.push({summary: summary, detail: detail, severity: severity});
        self.msgsCustomArray(msgs);

        oj.Components.setDefaultOptions({
            'editableValue':
                    {
                        'displayOptions':
                                {
                                    'messages': ['notewindow']
                                }
                    }
        });





        // define a click handler for the 'openDialogBtn'
        setTimeout(function () {
            $("#openDialogBtn").click(function () {
                $('#dialogForm').ojDialog('open');
            })
        }, 500);
        // define a click handler for the okButton
        $("#okButton").click(function () {
            $("#dialogForm").ojDialog("close");
        });

        // click handler for 'Cancel' button that sets value to null for all components
        $("#cancelButton").click(function () {
            $("#inputcontrol").ojInputText("option", "value", null);
            $("#textareacontrol").ojTextArea("option", "value", null);
            $("#spinnercontrol").ojInputNumber("option", "value", null);
            $("#spinnercontrol").ojInputNumber("option", "value", null);
            $("#datecontrol").ojInputDate("option", "value", null);
            $("#timecontrol").ojInputTime("option", "value", null);
            $("#datetimecontrol").ojInputDateTime("option", "value", null);
            $("#combobox").ojCombobox("option", "value", []);
            $("#comboboxMulti").ojCombobox("option", "value", []);
            $("#select").ojSelect("option", "value", []);
            $("#inputSearch").ojInputSearch("option", "value", []);
            $("#checkboxSetId").ojCheckboxset("option", "value", []);
            $("#radioSetId").ojRadioset("option", "value", []);

            // reset the model

       
            // close the dialog
            $("#dialogForm").ojDialog("close");
        });

    }

    return lazyContentViewModel;
});
