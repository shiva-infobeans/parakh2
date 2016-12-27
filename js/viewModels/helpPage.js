/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * helpPage module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojinputtext', 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'ojs/ojdialog', 'promise', 'ojs/ojlistview'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function helpPageContentViewModel() {
        var self = this;
          var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
                oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

        self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable('(min-width: 767px)');

       self.itemOnly = function (context)
        {
            return context['leaf'];
        }
        
        this.email = person['email'];       
        self.message = ko.observable();
        self.textError = ko.observable();
        self.sucessMsg = ko.observable();
        self.userName = ko.observable();

 var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.userName(res['attributes']['data']['google_name']);               
            }
        });

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
                    data: {desc: self.message(),from: self.email,from_name: self.userName()},
                    success: function () {
                        console.log('sent');
                        console.log(self.email);
                        console.log(self.message());
                         console.log( self.userName());
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
            self.handleOpen = $(".help-feedback").click(function () {
                $("#modalDialog-userFeedback").ojDialog("open");
                self.message('');
                self.textError('');
            });
        },
                500);
    }
    
    return helpPageContentViewModel;
});
