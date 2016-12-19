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
        self.desktopImg = ko.observable();


        self.mobileImg = ko.observable();

        var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);

        self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);

        setTimeout(function () {
            self.handleOpen = $(".sideBar-feedback").click(function () {
                $("#modalDialog-userFeedback").ojDialog("open");
            });
        }, 500);
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

    }

    return sideBarContentViewModel;
});
