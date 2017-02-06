/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * footer module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    
    
    function footerContentViewModel() {
        var self = this;
        
      setTimeout(function(){
             $("#yearFooter").text( (new Date).getFullYear() );
      },500);
             
    }
    return footerContentViewModel;
});
