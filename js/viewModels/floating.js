/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * floating module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function floatingContentViewModel() {
        var self = this;
//        open popUp on click and close on cross click
          setTimeout(function () {
            self.handleOpen = $(".rateFloat").click(function () {
                $("#modalDialog3").ojDialog("open");
            });

            self.handleOKClose = $("#okButton").click(function () {
               $("#modalDialog3").ojDialog("close");
            });
        }, 500);
        
        }
    return floatingContentViewModel;
});
