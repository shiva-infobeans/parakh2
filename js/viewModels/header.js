/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'jquery'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */

    function headerContentViewModel(person) {
        var self = this;
        self.signout = function () {
            signOut();
            function signOut() {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    setTimeout(function () {
                        console.log(window.location);
                        window.location = "http://" + window.location.hostname;
                    }, 1000);
                });
            }
            setCookie("email", "", 0);
            setCookie("name", "", 0);
            setCookie("picture", "", 0);
        }
        this.mypic = person['pic'];
        this.memberName = "My Profile";
        var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);

        setTimeout(function () {

        }, 500);
               
        /*$(document).ready(function () {
            $("#forActive ul li a").each(function () {
                console.log("Working...");
                if ($(this).attr("href") == pgurl || $(this).attr("href") == '') {
                    $(this).parent().addClass("active");
                }
            });
        });
        */
    }
    
    jQuery(document).ready(function () {
           alert(jQuery('#forActive').html());
            /*$("#forActive ul li a").each(function () {
                console.log("Working...");
                if ($(this).attr("href") == pgurl || $(this).attr("href") == '') {
                    $(this).parent().addClass("active");
                }
            });*/
            alert('is here???');
        });
    
    return headerContentViewModel;
});
