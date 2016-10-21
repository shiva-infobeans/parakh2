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
                    console.log('User signed out.');
                    setTimeout(function () {
                        console.log(window.location);
                        window.location = "http://" + window.location.hostname;
                    }, 2000);
                });
            }
        }
        this.pic = person['pic'];
        this.memberName = "My Profile";

        $(function () {
            setTimeout(function () {
                var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
                $("#forActive ul li a").each(function () {
                    if ($(this).attr("href") == pgurl || $(this).attr("href") == '') {
                        $(this).parent().addClass("active");
                    }
                });
            }, 500);
        });

    }

    return headerContentViewModel;
});
