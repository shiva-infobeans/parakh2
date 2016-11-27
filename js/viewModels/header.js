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
        if (type == '+1') {
            type1 = "zmdi-plus-1";
            obj.backColor = '#01C854';
        }
        if (type == '-1') {
            type1 = "zmdi-neg-1";
            obj.backColor = '#F34334';
        }
        if (type == 'feedback') {
            type1 = "zmdi-comment-alt-text";
            obj.backColor = '#009985';
        }
        if (type == 'approved') {
            type1 = "zmdi-check checkIconNotify";
            obj.backColor = '#01B0FF';
        }
        if (type == 'declined') {
            type1 = "zmdi-close closeIconNotify";
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
        self.notifCount = ko.observable();
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
                            var notificationData = new Object();

                            if (data[c]['rating'] == '+1') {
                                notificationData.type = "+1";
                                if (self.userId() == data[c]['given_by']) {
//                                    you rated --- +1 ratedby
                                    notificationData.comment = "You rated " + data[c]['ratedby'] + " +1";

                                } else {
                                    notificationData.comment = data[c]['rated_to'] + " rated you +1";
                                }
                            }
                            if (data[c]['rating'] == '-1') {
                                notificationData.type = "-1";
                                if (self.userId() == data[c]['given_by']) {
                                    notificationData.comment = "You rated " + data[c]['ratedby'] + " -1";

                                } else {
                                    notificationData.comment = data[c]['rated_to'] + " rated you -1";
                                }
                            }
                            if (data[c]['rating'] == 'feedback') {
                                notificationData.type = "feedback";
                                notificationData.comment = data[c]['ratedby'] + " gave you feedback";
                            }
                            if (data[c]['rating'] == 'approved') {
                                notificationData.type = "approved";
                                if (self.userId() == data[c]['given_by']) {
                                    notificationData.comment = data[c]['ratedby'] + " approved your request";

                                } else {
                                    notificationData.comment = "You approved " + data[c]['rated_to'] + "'s request";
                                }
                            }
                            if (data[c]['rating'] == 'declined') {
                                notificationData.type = "declined";
                                if (self.userId() == data[c]['given_by']) {
                                    notificationData.comment = data[c]['ratedby'] + " declined your request";
                                } else {
                                    notificationData.comment = "You declined " + data[c]['rated_to'] + "'s request";
                                }
                            }
                            if (data[c]['rating'] == 'response-feedback') {
                                notificationData.type = "response-feedback";
                                notificationData.comment = data[c]['ratedby'] + " responded on your feedback";
                            }
                            self.notif.push(new notificationContent(notificationData.type, notificationData.comment));
                        }
                    }
                });
                var getNotification = oj.Model.extend({
                    url: notificationCount + self.userId()
                });
                var getNotifyId = new getNotification();
                getNotifyId.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        if (res['attributes']['data'][0]['msg_read'] == 0) {
                            $('.notif-count').hide();
                        } else {
                            self.notifCount(res['attributes']['data'][0]['msg_read']);
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
            $(".openCloseNotify a, .notif-count").on('click', function () {
                
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: resetNotifCount,
                    data: {userId: self.userId()},
                    success: function () {
                        self.notifCount("");
                        $('.notif-count').hide();
                    }
                });

            });

            

        }, 500);

        self.toggleMenu = function(){
            if($('#forActive-mobile #forActiveul').css('display')=='block')
            {
                $('#forActive-mobile #forActiveul').css('display','none');
            }else
            {
                $('#forActive-mobile #forActiveul').css('display','block');
            }
            
        }

        /*hide show notification*/
        $(document).mouseup(function (e)
        {
            var container = $(".notification");
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                if($(e.target).attr('class')!='zmdi zmdi-notifications  zmdi-hc-lg' && $('.notification').css('display')=='block'){
                    $(".notification").css('display','none');
                }
            }

        });

        $(document).ready(function(){

            var width = screen.width,
                height = screen.height;
            setInterval(function () {
                if (screen.width !== width || screen.height !== height) {
                    width = screen.width;
                    height = screen.height;
                    $('#forActive-mobile #forActiveul').css('display','none');
                    $(window).trigger('resolutionchange');
                }
            }, 50);
            $('#notificationOpen').on('click',function(){
                if($('.notification').css('display')== 'none'){
                    $(".notification").css('display','block');
                }else
                {
                    $(".notification").css('display','none');
                }
            });
        });
    }

    
    return headerContentViewModel;
});
