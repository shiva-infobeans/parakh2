/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * sideBar module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox', 'ojs/ojmodel'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function sideBarContentViewModel(person) {
        var self = this;
        this.email = person['email'];
        self.message = ko.observable();
        self.textError = ko.observable();
        self.sucessMsg = ko.observable();
        self.userName = ko.observable();

        self.desktopImg = ko.observable();

        self.mobileImg = ko.observable();

        var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);

        self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);

        self.openTour = function () {
            var getUser = oj.Model.extend({
                url: getUserByEmail + person['email']
            });
            var getId = new getUser();
            getId.fetch({
                headers: {secret: secret},
                success: function (res) {

                    var role = res['attributes']['data']['role_name'];
                    if (role == "Team Member") {
                        if ($(window).width() == 768) {
                            self.desktopImg('images/help-ipad(member).jpg');
                        } else {
                            self.desktopImg('images/userGuide(member).jpg');
                            self.mobileImg('images/userGuide-member-mobile.jpg');
                        }
                    } else {
                        if ($(window).width() == 768) {
                            self.desktopImg('images/help-ipad(manager).jpg');
                        } else {
                            self.mobileImg('images/userGuide-manager-mobile.jpg');
                            self.desktopImg('images/help(manager-desktop).jpg');
                        }
                    }

                }
            });

            $("#guideTour").removeClass('hide');
        }
        self.closeTour = function () {

            $("#guideTour").addClass('hide');
        }


        var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                var user = oj.Model.extend({
                    url: checkUserForFirstTime + res['attributes']['data']['id']
                });
                var getId = new user();
                getId.fetch({
                    headers: {secret: secret},
                    success: function (res1) {
                        if (res1['attributes']['data']['firstLogin'] == 0) {
                            var getUser = oj.Model.extend({
                                url: getUserByEmail + person['email']
                            });
                            var getId = new getUser();
                            getId.fetch({
                                headers: {secret: secret},
                                success: function (res2) {

                                    var role = res2['attributes']['data']['role_name'];
                                    if (role == "Team Member") {
                                        if ($(window).width() == 768) {
                                            self.desktopImg('images/help-ipad(member).jpg');
                                        } else {
                                            self.desktopImg('images/userGuide(member).jpg');
                                            self.mobileImg('images/userGuide-member-mobile.jpg');
                                        }
                                    } else {
                                        if ($(window).width() == 768) {
                                            self.desktopImg('images/help-ipad(manager).jpg');
                                        } else {
                                            self.mobileImg('images/userGuide-manager-mobile.jpg');
                                            self.desktopImg('images/help(manager-desktop).jpg');
                                        }
                                    }

                                }
                            });
                            $("#guideTour").removeClass('hide');
                        }
                    }
                });
                self.userName(res['attributes']['data']['google_name']);
            }
        });

        self.userFeedback = function () {
            self.message(self.message().trim());
            if (self.message() === '' || self.message() === null) {
                self.textError("Please provide comments for your feedback.");
                return false;
            } else {
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: sendFeedback,
                    data: {desc: self.message(), from: self.email, from_name: self.userName()},
                    success: function () {
                        $("#modalDialog-userFeedback").ojDialog("close");
                        $("#sucessFeedback").show();
                        self.sucessMsg("Feedback sent successfully!");
                        setTimeout(function () {
                            $("#sucessFeedback").hide();
                            self.sucessMsg("");
                        }, 10000);
                    },
                    beforeSend: function () {
                        $("#userToParakh").removeClass('loaderHide');
                    },
                    complete: function () {
                        $("#userToParakh").addClass('loaderHide');
                    }

                });
            }
        }
        setTimeout(function () {
            self.handleOpen = $(".sideBar-feedback").click(function () {
                $("#modalDialog-userFeedback").ojDialog("open");
                self.message('');
                self.textError('');
            });
        },
                500);
    }

    return sideBarContentViewModel;
});
