/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * sideBar module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox', 'ojs/ojmodel'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function sideBarContentViewModel() {
        var self = this;
        setTimeout( function(){
              self.handleOpen = $(".sideBar-feedback").click(function () {
                $("#modalDialog-userFeedback").ojDialog("open");
            });         
        },500);
        
        
        

    }
    
    return sideBarContentViewModel;
});
