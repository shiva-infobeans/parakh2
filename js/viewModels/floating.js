/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * floating module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox', 'ojs/ojmodel'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function teamMember(data) {
        var member = this;
        member.name = data['google_name'];
        member.userId = data['id'];
        member.pic = data['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data['google_picture_link'];
        member.designation = data['designation'];
        member.role_name = data['role_name'];
        member.google_id = data['google_id'];
        return member;
    }

    function autoSearch(data) {
        var searchUser = new Object();
        searchUser.searchId = data['id'];
        searchUser.searchName = data['google_name'];
        searchUser.searchPic = data['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data['google_picture_link'];
        return searchUser;
    }

    function floatingContentViewModel(person) {
        var self = this;


        setTimeout(function () {
            self.handleOpen = $(".rateFloat").click(function () {
                $("#modalDialog3").ojDialog("open");
                self.desc('');
                self.textError('');
                self.value([]);
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog3").ojDialog("close");
            });
            self.handleOpen = $(".feedBackFloat").click(function () {
                $("#modalDialog9").ojDialog("open");
                self.desc('');
                self.textError('');
                self.value([]);
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog9").ojDialog("close");
            });
        }, 500);



        self.member = ko.observableArray([]);
        self.searchUser = ko.observableArray([]);
        self.searchId = ko.observable();
        self.userIdFloat = ko.observable();
        self.for_id = ko.observable();
        self.desc = ko.observable();
        self.textError = ko.observable();
        var userFloat = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getFloatId = new userFloat();
        getFloatId.fetch({
            headers: {secret: secret},
            success: function (result) {
                self.userIdFloat(result['attributes']['data']['id']);

                var getSearchUser = oj.Model.extend(
                        {
                            url: getAllTeamMembers + self.userIdFloat(),
                        });

                var floatMember = new getSearchUser();
                floatMember.fetch({
                    headers: {secret: secret},
                    success: function () {
                        var data = floatMember.attributes['data'];
                        for (var counter1 = 0; counter1 < data.length; counter1++) {
                            self.searchUser.push(new autoSearch(data[counter1]));
                            var item = new Object();
                            item.value = data[counter1]['id'];
                            item.label = data[counter1]['google_name'];
                            item.searchPic = data[counter1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data[counter1]['google_picture_link'];
                            self.browsers.push(item);
                            self.browsers1.push(item);
                        }
                    }
                });
            }
        });
        self.feedbackModal = function(){
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please Provide a feedback for your rating");
                return false;
            } else {
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: addFeedback,
                    data: {feedback_from: self.userIdFloat(), feedback_to: self.value1()[0], feedback_description: self.desc()},
                    success: function () {
                        $("#modalDialog9").ojDialog("close");
                        self.value('');
                    }
                });
            }
        }
        this.browsers = ko.observableArray([]);
        this.value = ko.observable();
        this.browsers1 = ko.observableArray([]);
        this.value1 = ko.observable();
          self.floatModal = function () {
              if (self.desc() == '' || self.desc() == null || self.value() == '' || self.value() == null) {
                        self.textError("Please Provide a reason for your rating");
                        return false;
                    } else {
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: rateOtherMember,
                    data: {user_id: self.userIdFloat(), for_id: self.value()[0],rating:1, desc: self.desc()},
                    success: function () {
                        $("#modalDialog3").ojDialog("close");
                        self.value('');
                    }
                });
            }
        }
    }
    return floatingContentViewModel;
});
