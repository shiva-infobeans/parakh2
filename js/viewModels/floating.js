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

    function requestSearch(data) {
        var autoSearchLead = new Object();
        autoSearchLead.autoSearcUserId = data['user_id'];
        autoSearchLead.autoSearchLeadMId = data['manager_id'];
        autoSearchLead.autoSearchLeadName = data['manager_name'];
        autoSearchLead.autoSearchLeadPic = data['google_picture_link'];
        autoSearchLead.autoSearchLeadRole = data['role_name'];
        return autoSearchLead;
    }
    function floatingContentViewModel(person) {
        var self = this;

        setTimeout(function () {
            //rate other team member modal from floating button 
            self.handleOpen = $(".rateFloat").click(function () {
                $("#modalDialog3").ojDialog("open");
                self.desc('');
                self.textError('');
                self.value([]);
                self.searchError("");
                $("#rateFloatTextError").addClass('hide');
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog3").ojDialog("close");
            });

            //give feedback to other team member modal from floating button 
            self.handleOpen = $(".feedBackFloat").click(function () {
                $("#modalDialog9").ojDialog("open");
                self.desc('');
                self.value1([]);
                $("#feedbackFloatSearchError").addClass('hide');
                $("#feedbackFloatTextError").addClass('hide');

            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog9").ojDialog("close");
            });

            //request for +1 rating modal from floating button to his respective lead or manager  
            self.handleOpen = $(".requestFloat").click(function () {
                $("#modalDialogRequest").ojDialog("open");
                self.desc('');
                self.textError('');
                self.value2([]);
                self.searchError("");

            });
            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialogRequest").ojDialog("close");
            });
        }, 500);

        self.member = ko.observableArray([]);
        self.searchUser = ko.observableArray([]);
        self.autoSearchLead = ko.observableArray([]);
        self.searchId = ko.observable();
        self.userIdFloat = ko.observable();
        self.for_id = ko.observable();
        self.desc = ko.observable();
        self.textError = ko.observable();
        self.searchError = ko.observable();
        self.role_name = ko.observable();

        var userFloat = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getFloatId = new userFloat();
        getFloatId.fetch({
            headers: {secret: secret},
            success: function (result) {
                self.userIdFloat(result['attributes']['data']['id']);
                self.role_name(result['attributes']['data']['role_name']);

                if (self.role_name() === 'Team Member') {
                    $('#hideFeedbackFloat').hide();

                } else {
                    $('#hideFeedbackFloat').show();
                }

                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: getOtherTeamMembers + self.userIdFloat(),
                    data: {user_id: self.userIdFloat()},
                    success: function (task) {

                        var data = JSON.parse(task)['data'];
						console.log(data);
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
                // var getSearchUser = oj.Model.extend(
                //         {
                //             url: getAllTeamMembers + self.userIdFloat(),
                //         });

                // var floatMember = new getSearchUser();
                // floatMember.fetch({
                //     headers: {secret: secret},
                //     success: function () {
                //         var data = floatMember.attributes['data'];
                //         for (var counter1 = 0; counter1 < data.length; counter1++) {
                //             self.searchUser.push(new autoSearch(data[counter1]));
                //             var item = new Object();
                //             item.value = data[counter1]['id'];
                //             item.label = data[counter1]['google_name'];
                //             item.searchPic = data[counter1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data[counter1]['google_picture_link'];
                //             self.browsers.push(item);
                //             self.browsers1.push(item);
                //         }
                //     }
                // });
            }
        });
        //auto search for respective team lead or manager
        var userFloat = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getFloatId = new userFloat();
        getFloatId.fetch({
            headers: {secret: secret},
            success: function (result) {
                self.userIdFloat(result['attributes']['data']['id']);
                // console.log(result['attributes']['data']['id']);
                var getautoSearchLead = oj.Model.extend(
                        {
                            url: getAllLeads + self.userIdFloat(),
                        });
                var teamLeadSearch = new getautoSearchLead();
                teamLeadSearch.fetch({
                    headers: {secret: secret},
                    success: function () {
                        var data = teamLeadSearch.attributes['data'];
                        if (data.length == 2) {

                            var item1 = new Object();

                            item1.value = data[0]['manager_id'];
                            item1.label = data[0]['manager_name'];
                            item1.autoSearchLeadPic = data[0]['google_picture_link'];
                            item1.autoSearchLeadRole = data[0]['role_name'];

                            var item2 = new Object();
                            item2.value = data[1]['manager_id'];
                            item2.label = data[1]['manager_name'];
                            item2.autoSearchLeadPic = data[1]['google_picture_link'];
                            item2.autoSearchLeadRole = data[1]['role_name'];

                            if (item1.value == item2.value) {
                                self.browsers2.push(item1);
                            } else {
                                self.browsers2.push(item1);
                                self.browsers2.push(item2);
                            }
                        } else {
                            var item1 = new Object();
                            item1.value = data[0]['manager_id'];
                            item1.label = data[0]['manager_name'];
                            item1.autoSearchLeadPic = data[0]['google_picture_link'];
                            item1.autoSearchLeadRole = data[0]['role_name'];
                            self.browsers2.push(item1);
                        }
                    }
                });
            }
        });



        self.feedbackModal = function () {
            if (self.value1() == '' || self.value1() == null) {

                console.log($("#feedbackFloatSearchError").removeClass('hide'));
                return false;
            }
            if (self.desc() == '' || self.desc() == null) {
                $("#feedbackFloatSearchError").addClass('hide');
                console.log($("#feedbackFloatTextError").removeClass('hide'));
                return false;
            }
            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: addFeedback,
                data: {feedback_from: self.userIdFloat(), feedback_to: self.value1()[0], feedback_description: self.desc()},
                success: function () {
                    $("#modalDialog9").ojDialog("close");
                    self.value('');
                    $("#sucess").show();
                    self.sucessMsg("Feedback is sent!");
                    setTimeout(function () {
                        $("#sucess").hide();
                        self.sucessMsg("");
                    }, 3000);
                },
                beforeSend: function () {
                    $("#loaderScreen").removeClass('loaderHide');
                },
                complete: function () {
                    $("#loaderScreen").addClass('loaderHide');
                }
            });

        }
        this.browsers = ko.observableArray([]);
        this.value = ko.observable();
        this.browsers1 = ko.observableArray([]);
        this.value1 = ko.observable();
        this.browsers2 = ko.observableArray([]);
        this.value2 = ko.observable();

        this.sucessMsg = ko.observable("S");
        this.sucessMsg("");

        self.floatModal = function () {
            if (self.value() == '' || self.value() == null) {
                self.searchError("This field cannot be empty");
                return false;
            }
            if (self.desc() == '' || self.desc() == null) {
                self.searchError("");
                $("#rateFloatTextError").removeClass('hide');
                return false;
            }

            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: rateOtherMember,
                data: {user_id: self.userIdFloat(), for_id: self.value()[0], rating: 1, desc: self.desc()},
                success: function () {
                    $("#modalDialog3").ojDialog("close");
                    self.value('');
                    $("#sucess").show();
                    self.sucessMsg("Member rated successfully!");
                    setTimeout(function () {
                        $("#sucess").hide();
                        self.sucessMsg("");
                    }, 3000);
                },
                beforeSend: function () {
                    $("#loaderScreen").removeClass('loaderHide');
                },
                complete: function () {
                    $("#loaderScreen").addClass('loaderHide');
                }
            });

        }


        //send request for +1 ratings ajax call
        self.requestModal = function (event) {


            if (self.value2() == '' || self.value2() == null) {
                self.searchError("This field cannot be empty");
                return false;
            }
            if (self.desc() == '' || self.desc() == null) {
                self.searchError("");
                self.textError("Please provide a reason for your request.");
                return false;
            }
            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: requestForOne,
                data: {u_id: self.userIdFloat(), l_id: self.value2()[0], desc: self.desc()},
                success: function () {
                    $("#modalDialogRequest").ojDialog("close");
                    $("#sucess").show();
                    self.sucessMsg("Your request is sent!");
                    setTimeout(function () {
                        $("#sucess").hide();
                        self.sucessMsg("");
                    }, 3000);
                    self.value2('');

                },
                beforeSend: function () {
                    $("#loaderScreen").removeClass('loaderHide');
                },
                complete: function () {
                    $("#loaderScreen").addClass('loaderHide');
                }

            });

        }

    }
    return floatingContentViewModel;
});
