/**
 * achivementHeader module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function achivementHeaderContentViewModel() {
        var self = this;
        self.backToLogin = function(){
            window.location = "http://"+window.location.host;
        }
    }
    
    return achivementHeaderContentViewModel;
});

