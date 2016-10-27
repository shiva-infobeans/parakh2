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
            setCookie("email", "", 0);
            setCookie("name", "", 0);
            setCookie("picture", "", 0);
            window.location = "http://" + window.location.hostname;
            function setCookie(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            }
        }
        this.mypic = person['pic'];
        this.memberName = "My Profile";
        var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);

        setTimeout(function () {
            $("#forActive ul li a").each(function () {
                if ($(this).attr("href") == pgurl || $(this).attr("href") == '') {
                    $(this).parent().addClass("active");
                }
            });
            $(".openCloseNotify").on('click', function () {
                    $('.notification').toggle();
            });

//            $('body').click(function (e) {
//                    $('.notification').addClass('hide');
//            });
        }, 500);
    }
    return headerContentViewModel;
});
