/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodel'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function notificationContent(type, comment) {
        var obj = new Object();
        obj.backColor = '';
        var type1 = 'abc';
        if (type == 'positive') {
            type1 = "zmdi-plus-1";
            obj.backColor = '#01C854';
        }
        if (type == 'negative') {
            type1 = "zmdi-neg-1";
            obj.backColor = '#F34334';
        }
        if (type == 'feedback') {
            type1 = "zmdi-comment-alt-text";
            obj.backColor = '#009985';
        }
        if (type == 'response-one-approve') {
            type1 = "zmdi-check";
            obj.backColor = '#01B0FF';
        }
        if (type == 'response-one-reject') {
            type1 = "zmdi-close";
            obj.backColor = '#EC6748';
        }
        if (type == 'response-feedback') {
            type1 = "zmdi-comments";
            obj.backColor = '#8F6E5F';
        }
        obj.element = '<i class="color-black zmdi ' + type1 + '"></i>';
        obj.notificationComment = comment;
        return obj;
    }
    function headerContentViewModel(person) {
        var self = this;
        self.notif = ko.observableArray();
        self.userId = ko.observable();
        self.notifCount = ko.observable("10");
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
        var getUser = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new getUser();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);
                var getNotification = oj.Model.extend({
                    url: notify + self.userId()
                });
                var getNotifyId = new getNotification();
                getNotifyId.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        var data = res['attributes']['data'];
                        for (var c = 0; c < data.length; c++) {
                            self.notif.push(new notificationContent(data[c]['notifyType'], data[c]['comment']));
                        }
                    }
                });
            }
        });
        setTimeout(function () {
            $("#forActive ul li a").each(function () {
                if ($(this).attr("href") == pgurl || $(this).attr("href") == '') {
                    $(this).parent().addClass("active");
                }
            });
            $(".openCloseNotify a, notif-count").on('click', function () {
                if($('.notification').hasClass('hide')){
                    $('.notification').removeClass('hide');
                }else{
                    $('.notification').addClass('hide');
                }
                self.notifCount("");
                $('.notif-count').hide();

            });
        }, 500);
    }
    return headerContentViewModel;
});
