/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * sideBar module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox', 'ojs/ojmodel'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function sideBarContentViewModel(person) {
        var self = this;

        this.email = person['email'];       
        self.message = ko.observable();
        self.textError = ko.observable();
        self.sucessMsg = ko.observable();

        self.userFeedback = function () {
            self.message(self.message().trim());
            if (self.message() === '' || self.message() === null) {
                self.textError("Please enter your feedback.");
                return false;
            } else {
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: sendFeedback,
                    data: {desc: self.message(),from: self.email},
                    success: function () {
                        console.log('sent');
                        console.log(self.email);
                        console.log(self.message());
                        $("#modalDialog-userFeedback").ojDialog("close");
                        $("#sucess").show();
                        self.sucessMsg("Feedback sent successfully!");
                        setTimeout(function () {
                            $("#sucess").hide();
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
