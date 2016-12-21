/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * floating module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox', 'ojs/ojmodel', 'accordin/helpTextMsg'
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
    function nameFunction(NAME) {
        var initial = NAME.charAt(0) + NAME.charAt(NAME.lastIndexOf(" ") + 1);
        return initial;
    }
    function floatingContentViewModel(person) {
        var self = this;
        self.showHelpSearch = ko.observable();
        self.showHelpComment = ko.observable();

        setTimeout(function () {
            //rate other team member modal from floating button 
            self.handleOpen = $(".rateFloat").click(function () {
                $("#modalDialog3").ojDialog("open");
                self.desc('');
                self.textError('');
                self.value([]);
                self.searchError("");
                $("#rateFloatTextError").addClass('hide');
                self.imagerank1("../../images/active(+1).png");
                self.imagerank2("../../images/active(+1).png");
                self.imagerank3("../../images/disable(-1).png");
                $('.text-area-plus-one').show();
                $('.text-area-both').hide();
                self.showHelpSearch(buddySearch);
                self.showHelpComment(buddyComment);
                self.p(1);
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
                self.showHelpSearch(feedbackSearch);
                self.showHelpComment(feedbackComment);
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
                self.showHelpSearch(reqSearch);
                self.showHelpComment(reqComment);
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
        self.currentChangeid = ko.observable(0);

        
        
        self.rateValueChangeHandler = function (context, valueParam) {
            if(self.value() != ""){
                self.showHelpSearch("");
            }
            if (!isNaN(valueParam.value[0]))
            {
                self.currentChangeid(valueParam.value[0]);
            }
            if (valueParam.option == 'rawValue')
            {
                try {
                    var spaceCount = (valueParam.value.split(" ").length - 1);
                    var name = valueParam.value.replace(/ /g, "");
                    if (spaceCount > 2) {
                        name = name.substring(0, name.length - 2);
                    }
                    if (name != '') {
                        name = name.replace(/([A-Z])/g, ' $1').trim();
                        var id = "#" + name.replace(/ /g, "_").toLowerCase();

                        $('#oj-combobox-input-combobox2').val(name);
                        if (typeof $(id).val() != 'undefined' && $(id).val() == 1)
                        {
                            $('.text-area-plus-one').hide();
                            $('.text-area-both').show();
                        } else
                        {
                            $('.text-area-plus-one').show();
                            $('.text-area-both').hide();
                        }
                    }
                } catch (e)
                {
                    console.log(e);
                }
            }

            // $('.search-text-profile-image').each(function(){
            //     alert($("."+$(this).attr('class')+" .autoName").html());
            // });
        }

        self.descEvent = function(){
            console.log("a");
        }
        self.requestValueChangeHandler = function (context, valueParam) {
            
            if (!isNaN(valueParam.value[0]))
            {
                self.currentChangeid(valueParam.value[0]);
            }
            if (valueParam.option == 'rawValue')
            {
                try {
                    var spaceCount = (valueParam.value.split(" ").length - 1);
                    var name = valueParam.value.replace(/ /g, "");
                    if (spaceCount > 6) {
                        name = name.substring(0, name.length - 2);
                    }
                    name = name.replace(/([A-Z])/g, ' $1').trim();
                    id = "#" + name.replace(/ /g, "_").toLowerCase();
                    $('#oj-combobox-input-combobox3').val(name);
                } catch (e)
                {
                    console.log(e);
                }
            }
        }

        self.feedbackValueChangeHandler = function (context, valueParam) {
            if (!isNaN(valueParam.value[0]))
            {
                self.currentChangeid(valueParam.value[0]);
            }
            if (valueParam.option == 'rawValue')
            {
                try {
                    var spaceCount = (valueParam.value.split(" ").length - 1);
                    var name = valueParam.value.replace(/ /g, "");
                    if (spaceCount > 2) {
                        name = name.substring(0, name.length - 2);
                    }
                    name = name.replace(/([A-Z])/g, ' $1').trim();
                    id = "#" + name.replace(/ /g, "_").toLowerCase();
                    $('#oj-combobox-input-combobox9').val(name);
                } catch (e)
                {
                    console.log(e);
                }
            }
        }
        

        self.p = ko.observable(1);

        // +1 rating on green button 
        self.imagerank1 = ko.observable(src = "../../images/active(+1).png");
        self.imagerank2 = ko.observable(src = "../../images/active(+1).png");
        self.imagerank3 = ko.observable(src = "../../images/disable(-1).png");
        this.plusOne = function () {
            self.p(1);
            self.imagerank2("../../images/active(+1).png")
            self.imagerank3("../../images/disable(-1).png");
        };
        //-1 ratig on red button image

        this.minusOne = function () {
            self.p(0);
            self.imagerank2("../../images/disable(+1).png");
            self.imagerank3("../../images/active(-1).png");

        };

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
                    url: getAllTeamMembers + self.userIdFloat(),
                    data: {user_id: self.userIdFloat()},
                    success: function (task) {

                        var data = JSON.parse(task)['data'];
                        for (var counter1 = 0; counter1 < data.length; counter1++) {
                            self.searchUser.push(new autoSearch(data[counter1]));
                            var item = new Object();
                            item.value = data[counter1]['id'];
                            item.label = data[counter1]['google_name'];
                            item.searchPic = data[counter1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data[counter1]['google_picture_link'];
                            item.optionId = data[counter1]['google_name'].replace(/ /g, "_").toLowerCase();
                            item.isManager = data[counter1]['is_manager_current_user'];
                            if (data[counter1]['google_picture_link'] == '/images/default.png')
                            {
                                item.intials_rate = nameFunction(data[counter1]['google_name']);
                            } else
                            {
                                item.intials_rate = '';
                            }
                            self.browsers.push(item);
                        }
                    }
                });

                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: getUserByLead + self.userIdFloat(),
                    data: {user_id: self.userIdFloat()},
                    success: function (task) {

                        var data = JSON.parse(task)['data'];
                        for (var counter1 = 0; counter1 < data.length; counter1++) {
                            self.searchUser.push(new autoSearch(data[counter1]));
                            var item = new Object();
                            item.value = data[counter1]['user_id'];
                            item.label = data[counter1]['google_name'];
                            item.searchPic = data[counter1]['picture'] == "" ? 'images/warning-icon-24.png' : data[counter1]['picture'];
                            if (data[counter1]['picture'] == '/images/default.png')
                            {
                                item.intials_feedback = nameFunction(data[counter1]['google_name']);
                            } else
                            {
                                item.intials_feedback = '';
                            }
                            self.browsers1.push(item);
                        }
                    }
                });
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
                            if (data[0]['google_picture_link'] == '/images/default.png')
                            {
                                item1.intials_request = nameFunction(data[0]['manager_name']);
                            } else
                            {
                                item1.intials_request = '';
                            }

                            var item2 = new Object();
                            item2.value = data[1]['manager_id'];
                            item2.label = data[1]['manager_name'];
                            item2.autoSearchLeadPic = data[1]['google_picture_link'];
                            item2.autoSearchLeadRole = data[1]['role_name'];
                            if (data[1]['google_picture_link'] == '/images/default.png')
                            {
                                item2.intials_request = nameFunction(data[1]['manager_name']);
                            } else
                            {
                                item2.intials_request = '';
                            }
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
                            if (data[0]['google_picture_link'] == '/images/default.png')
                            {
                                item1.intials_request = nameFunction(item1.label);
                            } else
                            {
                                item1.intials_request = '';
                            }
                            self.browsers2.push(item1);
                        }
                    }
                });
            }
        });



        self.feedbackModal = function () {
            self.desc(self.desc().trim());
            if (self.value1() == '' || self.value1() == null) {

                $("#feedbackFloatSearchError").removeClass('hide');
                return false;
            }
            if (self.desc() == '' || self.desc() == null) {
                $("#feedbackFloatSearchError").addClass('hide');
                $("#feedbackFloatTextError").removeClass('hide');
                return false;
            }
            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: addFeedback,
                data: {feedback_from: self.userIdFloat(), feedback_to: self.currentChangeid(), feedback_description: self.desc()},
                success: function () {
                    $("#modalDialog9").ojDialog("close");
                    self.value('');
                    $("#sucess").show();
                    self.sucessMsg("Feedback sent successfully!");
                    setTimeout(function () {
                        $("#sucess").hide();
                        self.sucessMsg("");
                    }, 10000);
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
            self.desc(self.desc().trim());
            if (self.value() == '' || self.value() == null) {
                self.searchError("This field cannot be empty.");
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
                url: addRating,
                data: {from_id: self.userIdFloat(), to_id: self.currentChangeid(), rating: self.p(), desc: self.desc(), 'from_floating': 1},
                success: function (result) {
                    $("#modalDialog3").ojDialog("close");
                    self.value('');
                    $("#sucess").show();
                    self.sucessMsg("Member rated successfully!");
                    setTimeout(function () {
                        $("#sucess").hide();
                        self.sucessMsg("");
                    }, 10000);
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

            self.desc(self.desc().trim());
            if (self.value2() == '' || self.value2() == null) {
                self.searchError("This field cannot be empty.");
                return false;
            }
            if (self.desc() == '' || self.desc() == null) {
                self.searchError("");
                self.textError("Please provide a reason for your rating.");
                return false;
            }
            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: requestForOne,
                data: {u_id: self.userIdFloat(), l_id: self.currentChangeid(), desc: self.desc()},
                success: function () {
                    $("#modalDialogRequest").ojDialog("close");
                    $("#sucess").show();
                    self.sucessMsg("Request sent successfully!");
                    setTimeout(function () {
                        $("#sucess").hide();
                        self.sucessMsg("");
                    }, 10000);
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
        oj.Components.setDefaultOptions({
            'editableValue':
                    {
                        'displayOptions':
                                {
                                    'messages': ['notewindow']
                                }
                    }
                });

    }
    return floatingContentViewModel;
});
