/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * giveRatings module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function giveRatingsContentViewModel() {
        var self = this;
        self.fromId = ko.observable("113");
        self.toId = ko.observable("114");
        self.plusMinus = ko.observable("+1");
        self.desc = ko.observable("");
    }
    
    return giveRatingsContentViewModel;
});
