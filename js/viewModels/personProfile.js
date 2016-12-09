
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * personProfile module
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'ojs/ojcomponentcore', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojmodel', 'ojs/ojselectcombobox', 'ojs/ojdatetimepicker'],
        function (oj, ko, $)
        {
            function nameFunction(NAME) {
                var initial = NAME.charAt(0) + NAME.charAt(NAME.lastIndexOf(" ") + 1);
                return initial;
            }
            function decodeHtml(html) {
                var txt = document.createElement("textarea");
                txt.innerHTML = html;
                return txt.value;
            }
            var dateplusArray = [];
            var dateminusArray = [];
            function dataComment(comment1, commenter1, commentDate1, datafor) {
                commentDate1 = new Date(commentDate1);
                //commentDate1 = commentDate1.toDateString();
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                var com = this; // this is for object of this function
                com.comment = comment1;
                com.shortName = commenter1.replace(/[^A-Z]/g, '');
                com.commenter = commenter1;
                com.commentDate = commentDate1.getDate() + ' ' + monthNames[commentDate1.getMonth()] + ' ' + commentDate1.getFullYear();
                if (datafor) {
                    if (dateplusArray.indexOf(com.commentDate) == -1) {
                        dateplusArray.push(com.commentDate);
                    } else
                    {
                        com.commentDate = '';
                    }
                } else
                {
                    if (dateminusArray.indexOf(com.commentDate) == -1) {
                        dateminusArray.push(com.commentDate);
                    } else
                    {
                        com.commentDate = '';
                    }
                }
                return com;
            }
            function dateDiffCalender(Date1) {
                user_date = Date.parse(Date1);
                today_date = new Date();
                if (Date1 != '') {
                    diff_date = today_date - user_date;

                    num_years = diff_date / 31536000000;
                    num_months = (diff_date % 31536000000) / 2628000000;
                    num_days = ((diff_date % 31536000000) % 2628000000) / 86400000;
                    if (Math.floor(num_years) > 1)
                    {
                        num_years = Math.floor(num_years) + " Years";
                    } else
                    {
                        num_years = Math.floor(num_years) + " Year";
                    }

                    if (Math.floor(num_months) > 1)
                    {
                        num_months = Math.floor(num_months) + " Months";
                    } else
                    {
                        num_months = Math.floor(num_months) + " Month";
                    }
                    return num_years + " " + num_months;
                } else
                {
                    return '';
                }
            }
            function dateFormatter(commentDate1) {
                commentDate1 = new Date(commentDate1);
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                var dateReturn = commentDate1.getDate() + ' ' + monthNames[commentDate1.getMonth()] + ' ' + commentDate1.getFullYear();
                return dateReturn;
            }
            function dataFeedback(myId, data) {
                var feedbackObj = new Object();
                feedbackObj.shortName = nameFunction(data['given_by_name']);
                feedbackObj.myId = myId;
                feedbackObj.feedbackfrom = data['feedback_from'];
                feedbackObj.feedbackto = data['feedback_to'];
                feedbackObj.name = data['given_by_name'];
                feedbackObj.feedbackId = data['id'];
                feedbackObj.feedbackDescription = decodeHtml(data['description']);
                feedbackObj.replies = ko.observableArray();
                feedbackObj.uniqueId = "feedback" + data['id'];
                feedbackObj.replyBtnId = "replyBtn" + data['id'];
                feedbackObj.replyClose = "replyClose" + data['id'];
                feedbackObj.replySend = "replySend" + data['id'];
                feedbackObj.replyInput = "replyInput" + data['id'];

                // 2nd myId with rtoId change it when view profile page;
                var data_reply = data['reply'];
                for (var c = 0; c < data_reply.length; c++) {
                    feedbackObj.replies.push(new feedbackRepliesData(myId, myId, feedbackObj.feedbackId, data_reply[c]));
                }
                feedbackObj.feedbackDate = dateFormatter(data['created_date'].substring(0, data['created_date'].indexOf(" ")));
                return feedbackObj;
            }
            function feedbackRepliesData(lid, rtoId, fid, data) {
                var freplies = new Object();
                freplies.login_id = lid;
                freplies.freply_to = rtoId;
                freplies.feedback_id = fid;
                freplies.reply_name = data['from_name'];//display name
                freplies.reply_ShortName = nameFunction(data['from_name']);//display name
                freplies.reply_desc = decodeHtml(data['description']);//display desc
                freplies.reply_date = dateFormatter(data['created_date'].substring(0, data['created_date'].indexOf(" ")));// display date
                return freplies;
            }

            function dialogModel(person) {
                var self = this;

                this.pic = person['pic'];
                if(person['pic'] == '/images/default.png')
                {
                    this.intials = nameFunction(person['name']);
                }else
                {
                    this.intials = '';
                }
                this.myname = person['name'];
                this.email = person['email'];
                var abc = "Not Assigned";
                this.temporaryNumber = ko.observable();
                this.interestsOptions = ko.observableArray();
                this.projectOptions = ko.observableArray();
                this.primaryProjectOptions = ko.observableArray();
                this.designationOptions = ko.observableArray();
                this.feedback = ko.observable("GOOD WORK...  keep it up!!");
                this.feedbackContent1 = ko.observableArray([]);
                this.feedbackContent2 = ko.observableArray([]);
                this.commentDataPositive = ko.observableArray([]);
                this.commentDataNegative = ko.observableArray([]);
                self.moreLess = ko.observable("More");
                this.plus = ko.observable();
                this.minus = ko.observable();
                this.myNumber = ko.observable();
                this.primary_project = ko.observable();
                this.skills = ko.observable();
                this.interests = ko.observableArray();
                this.projects = ko.observableArray();
                this.location = ko.observable();
                this.associate_with_infobeans = ko.observable();
                this.NoCommentsN = ko.observable(""); // for negative comment
                this.NoCommentsP = ko.observable(""); // for positive comment
                self.id = ko.observable(0);
                self.mobileError = ko.observable();
                self.date = ko.observable();
                this.successful = ko.observable("S");
                this.successful("");
                this.designation = ko.observable(abc);
                self.desigError = ko.observable();
                this.minusSign = ko.observable('-');
                this.plusSign = ko.observable('+');
                self.selectedTab = ko.observable(0);

                var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
                        oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

                self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable('(min-width: 767px)');

                self.itemOnly = function (context)
                {
                    return context['leaf'];
                }
                
                var editVariable;
                var windowLocation = window.location;
                var id = windowLocation.search.substring(windowLocation.search.indexOf("=") + 1, windowLocation.search.length);

                if (id == "1") {
                    self.selectedTab(1);
                }

                self.feedbackMore1 = function (e, data) {

                    var obj = $("#feedback" + e.feedbackId);
                    obj.parent().prev('.open-more').slideToggle();
                    if (obj.prev().children("span").hasClass("hide")) {
                        var lcomment = e['lComment'];
                        obj.prev().children("span").removeClass("hide");
                        obj.children("span").children("span").children("i").addClass("zmdi-caret-up");
                        obj.children("span").children("span").children("i").removeClass("zmdi-caret-down");
                        obj.children("span").children("span:nth-child(2)").html("Less");
                        if (e['sComment'].length == 103) {
                            obj.parent().prev().prev().children().text(lcomment);
                        }


                    } else {
                        var scomment = e['sComment'];
                        obj.children("span").children("span:nth-child(2)").html("More");
                        obj.children("span").children("span").children("i").removeClass("zmdi-caret-up");
                        obj.children("span").children("span").children("i").addClass("zmdi-caret-down");
                        obj.prev().children("span").addClass("hide");
                        if (e['sComment'].length == 103) {
                            obj.parent().prev().prev().children().text(scomment);
                        }
                    }
                }


                self.replySubmit = function (e, data) {
                    var obj = $("#replyBtn" + e.feedbackId);
                    var id = obj.attr("loginUserId");
                    var feedback_to = obj.attr("feedback_to");
                    var responseDesc = obj.parent().next("span").children("input");
                    if (responseDesc.val().length == 0) {
                        return;
                    }
                    var fid = obj.attr("feedbackId");
                    var sysDate = new Date();
                    var dateString = dateFormatter(sysDate.toJSON().toString().substr(0, 10));

                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: addFeedbackResponse,
                        data: {login_user_id: id, feedback_to: feedback_to, feedback_desc: responseDesc.val(), feedback_id: fid},
                        success: function () {

                            obj.parent().parent().parent().prev().append(
                                    '<div class="oj-row oj-flex oj-margin-top oj-margin-bottom oj-margin-horizontal oj-padding-horizontal">' +
                                    '<div class="oj-xl-12 oj-lg-12 oj-md-12 oj-sm-12 oj-flex-item replyName">' +
                                    '<span>' + self.myname + '</span>' +
                                    '</div>' +
                                    '<div class="oj-xl-12 oj-lg-12 oj-md-12 oj-sm-12 oj-flex-item oj-flex replyComent">' +
                                    '<div class="oj-xl-12 oj-lg-12 oj-md-12 oj-sm-12 oj-flex-item"><span>' + responseDesc.val() + '</span></div>' +
                                    '<div class="oj-xl-12 oj-lg-12 oj-md-12 oj-sm-12 oj-flex-item oj-flex-bar"><span class="oj-flex-bar-end">' + dateString + '</span></div>' +
                                    '</div>' +
                                    '</div>'
                                    );
                            responseDesc.val("");
                        },
                        beforeSend: function () {
                            $("#respondLoader").removeClass('loaderHide');
                        },
                        complete: function () {
                            $("#respondLoader").addClass('loaderHide');
                        }
                    });
                }



                //update profile submit button ajax call
                self.updateProfile = function () {
                    var temp = 0;
                    if (designationsDefaultVar != self.designation())
                    {
                        temp = 1;
                    }
                    if (locationDefaultVar != self.location() && temp == 0)
                    {
                        temp = 1;
                    }
                    if (skillsDefaultVal.replace(/ /g, '') != self.skills() && temp == 0)
                    {
                        temp = 1;
                    }
                    if (projectsDefaultVal != self.projects() && temp == 0)
                    {
                        temp = 1;
                    }
                    if (interestsDefaultVar != self.interests() && temp == 0)
                    {
                        temp = 1;
                    }
                    if (primaryProjectDefaultVar != self.primary_project() && temp == 0)
                    {
                        temp = 1;
                    }
                    if (numberDefaultVar.substring(numberDefaultVar.indexOf("-") + 1) != self.temporaryNumber())
                    {
                        temp = 1;
                    }
                    if (associateDefaultVar != dateDiffCalender(self.date()))
                    {
                        temp = 1;
                    }
                    if (temp == 0)
                    {
                        $('.sucessMsg').show();
                        self.successful("Profile not updated.");
                        setTimeout(function () {
                            $('.sucessMsg').hide();
                        }, 10000);
                        return false;
                    }

                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: updateProfile,
                        data: {user_id: self.id(), desc: self.designation(), location: self.location(), skills: self.skills(), primary_project: self.primary_project(), date: self.date(), projects: self.projects(), interests: self.interests(), mob: self.temporaryNumber()},
                        success: function (res) {
                            var response = jQuery.parseJSON(res);
                            $('.sucessMsg').show();
                            if (response.error == "true")
                            {
                                self.successful(response.data.error);
                                if (response.data.code == "3013")
                                {
                                    self.myNumber(numberDefaultVar);
                                }
                            } else
                            {
                                self.successful("Profile updated successfully.");
                            }
                            setTimeout(function () {
                                $('.sucessMsg').hide();
                            }, 10000);
                        },
                        error: function (err) {
                            alert(err);
                        }
                    });
                }
                //////////////////// edit profile page

//service for id of the user.

                var TaskRecord = oj.Model.extend({
                    url: getUserByEmail + person['email'],
                    //parse: parseTask
                });
                var task = new TaskRecord();
                task.fetch({
                    headers: {secret: secret},
                    success: function () {
                        abc = task.attributes['data']['designation'];
                        self.id(task.attributes['data']['id']);
                        self.myname
                        self.designation(abc);
                        var num = task.attributes['data']['mobile_number'] == "" ? "NO NUMBER" : "+91-" + task.attributes['data']['mobile_number'].replace("+91-", "");
                        self.myNumber(num);
                        var regex = new RegExp(',', 'g');
                        self.skills(task.attributes['data']['skills'].replace(regex, ", "));
                        self.location(task.attributes['data']['location']);
                        if (task.attributes['data']['interests'].length != 0) {
                            interest = task.attributes['data']['interests'].split(",");
                            for (k = 0; k < interest.length; k++) {
                                self.interests(interest);
                            }
                        } else {
                            self.interests([]);
                        }
                        // task.attributes['data']['projects'] = task.attributes['data']['projects'].replace(",",", ");
                        if (task.attributes['data']['projects'].length != 0) {
                            project = task.attributes['data']['projects'].split(",");
                            self.projects(project);
                        } else {
                            self.projects([]);
                        }
                        self.primary_project(task.attributes['data']['primary_project']);
                        self.associate_with_infobeans(dateDiffCalender(task.attributes['data']['associate_with_infobeans']));
                        self.date(task.attributes['data']['associate_with_infobeans']);

                        //feedback for the user
                        var feedbackApi = oj.Model.extend({
                            url: getFeedbackById + self.id()
                        });
                        var apiObj = new feedbackApi();
                        apiObj.fetch({
                            headers: {secret: secret},
                            success: function (res) {
                                var data = res['attributes']['data'];
                                var index;
                                for (index = 0; index < data.length; index++) {
                                    self.feedbackContent1.push(new dataFeedback(self.id(), data[index]));
                                }
                                if (self.feedbackContent1().length == 0) {
                                    $("#noFeedback").show();
                                } else {
                                    $("#noFeedback").hide();
                                }
                            }
                        });

                        //calculate ratings of the user;
                        var rate = oj.Model.extend({
                            url: getRatingByUser + self.id(),
                            //parse: parseTask
                        });
                        var rateTask = new rate();
                        rateTask.fetch({
                            headers: {secret: secret},
                            success: function (res) {
                                var plus = 0;
                                var minus = 0;
                                var data = res['attributes']['data'];
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i]['rating'] == 0) {
                                        minus++;
                                        var temporaryComment = new dataComment(decodeHtml(data[i]['description']), data[i]['given_by_name'], data[i]['created_date'], 0);
                                        self.commentDataNegative.push(temporaryComment);
                                    } else {
                                        if (data[i]['rating'] == 1)
                                            plus++;
                                        var temporaryComment = new dataComment(decodeHtml(data[i]['description']), data[i]['given_by_name'], data[i]['created_date'], 1);
                                        self.commentDataPositive.push(temporaryComment);
                                    }
                                }
                                if (self.commentDataNegative().length == 0) {
                                    self.NoCommentsN("No Ratings Available ...!!");
                                    $("#noNegativeComment").show();
                                }
                                if (self.commentDataNegative().length != 0) {
                                    $("#noNegativeComment").hide();
                                }
                                if (self.commentDataPositive().length != 0) {
                                    $("#noPositiveComment").hide();
                                }
                                if (self.commentDataPositive().length == 0) {
                                    self.NoCommentsP("No Ratings Available ...!!");
                                    $("#noPositiveComment").show();
                                }
                                self.plus(plus);
                                self.minus(minus);
                                if (self.plus() == 0) {
                                    self.plusSign("");
                                } else {
                                    self.plusSign("+");
                                }
                                if (self.minus() == 0) {
                                    self.minusSign("");
                                } else {
                                    self.minusSign("-");
                                }
                            }
                        });
                    }
                });
                // close modal
                self.closeModal = function () {
                    $("#open-modal").fadeOut();
                    $("#open-modal").removeClass('open');
                    self.myNumber(self.temporaryNumber());
                };

                // submit edit profile modal for edit profile...
                self.buttonClick = function () {
                    if (self.designation() == '' || self.designation() == null) {//validation for input not null or not empty
                        self.desigError("Field Must Not Be Empty");
                    } else {
                        if (self.myNumber() != "") {
                            if (10 != self.myNumber().length || isNaN(self.myNumber())) {
                                self.mobileError("Enter Correct Mobile Number");
                                return;
                            }
                        }
                        self.mobileError("");
                        //user_id, mob, des
                        $.ajax({
                            headers: {secret: secret},
                            method: 'POST',
                            url: updateProfile,
                            data: {user_id: self.id(), mob: self.myNumber(), des: self.designation()},
                            success: function () {
                                $("#open-modal").fadeOut();
                                $("#open-modal").removeClass('open');
                                var num = self.myNumber() == "" ? "NO NUMBER" : "+91-" + self.myNumber();
                                self.myNumber(num);
                                self.successful("User Details Updated Successfully !!");
                                setTimeout(function () {
                                    self.successful("");
                                }, 5000);
                            }
                        });
                    }
                }
                /*edit all fields*/
                var designationsDefaultVar;
                var locationDefaultVar;
                var associateDefaultVar;
                var skillsDefaultVal;
                var projectsDefaultVal;
                var interestsDefaultVar;
                var primaryProjectDefaultVar;
                var numberDefaultVar;
                self.openAll = function () {
                    /*******************************Open Edit Designation block***********************/
                    designationsDefaultVar = self.designation();
                    editVariable = self.designationOptions();
                    self.designationOptions([]);
                    //get all desginations using ajax;
                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: getAllDesignations,
                        data: {},
                        success: function (res) {
                            var res = JSON.parse(res)['data'];
                            for (var c = 0; c < res.length; c++) {
                                var obj = new Object();
                                obj.name = res[c]['designation'];
                                self.designationOptions.push(obj);
                            }
                            $('#selectDesignation').ojSelect("refresh");
                        }
                    });
                    $('#designation-text').addClass('hide');
                    $('#designation-div').removeClass('hide');
                    /*******************************Open Edit Designation block***********************/

                    /*******************************Open Edit Location block***********************/
                    locationDefaultVar = self.location();
                    $('#location-text').addClass('hide');
                    $('#location-div').removeClass('hide');
                    /*******************************Open Edit Location block***********************/

                    /*******************************Open Edit Skills block***********************/
                    skillsDefaultVal = self.skills();
                    self.skills(skillsDefaultVal.replace(/ /g, ''));
                    $('#skills-text').addClass('hide');
                    $('#skills').removeClass('hide');
                    /*******************************Open Edit Skills block***********************/

                    /*******************************Open Edit Associated with block***********************/
                    associateDefaultVar = $('#associate-text').attr('defaultDate');
                    self.associate_with_infobeans(associateDefaultVar);
                    $('#associate-text').addClass('hide');
                    $('#associate-div').removeClass('hide');
                    /*******************************Open Edit Associated with block***********************/

                    /*******************************Open Edit Primary Project block***********************/
                    primaryProjectDefaultVar = self.primary_project();
                    self.primaryProjectOptions([]);
                    //get all projects using ajax;
                    var primaryprojects = oj.Model.extend({
                        url: getAllProjects,
                    });
                    var primaryprojectTask = new primaryprojects();
                    primaryprojectTask.fetch({
                        headers: {secret: secret},
                        success: function (res) {
                            for (var c = 0; c < res['attributes']['data'].length; c++) {
                                var obj = new Object();
                                obj.name = res['attributes']['data'][c]['name'];
                                self.primaryProjectOptions.push(obj);
                            }
                            $('#selectPrimaryProjects').ojSelect("refresh");
                            self.primary_project(res['attributes']['data'][0]['name']);
                        }
                    });
                    $('#primary-project-text').addClass('hide');
                    $('#primary-project-div').removeClass('hide');
                    /*******************************Open Edit Primary Project block***********************/

                    /*******************************Open Edit Past Project block***********************/
                    projectsDefaultVal = self.projects();
                    editVariable = self.projectOptions();
                    self.projectOptions([]);
                    //get all projects using ajax;
                    var projects = oj.Model.extend({
                        url: getAllProjects,
                    });
                    var projectTask = new projects();
                    projectTask.fetch({
                        headers: {secret: secret},
                        success: function (res) {
                            for (var c = 0; c < res['attributes']['data'].length; c++) {
                                var obj = new Object();
                                obj.name = res['attributes']['data'][c]['name'];
                                self.projectOptions.push(obj);
                            }
                            $('#selectProjects').ojSelect("refresh");
                        }
                    });
                    $('#projects-text').addClass('hide');
                    $('#projects-div').removeClass('hide');
                    /*******************************Open Edit Past Project block***********************/

                    /*******************************Open Edit Interest block***********************/
                    interestsDefaultVar = self.interests();
                    editVariable = self.interests();
                    self.interestsOptions([]);
                    //get all interests using ajax;
                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: getAllInterests,
                        data: {},
                        success: function (res) {
                            var res = JSON.parse(res)['data'];
                            for (var c = 0; c < res.length; c++) {
                                var obj = new Object();
                                obj.name = res[c]['interest'];
                                self.interestsOptions.push(obj);
                            }
                            $('#selectInterests').ojSelect("refresh");
                        }
                    });
                    $('#interest-text').addClass('hide');
                    $('#interest-div').removeClass('hide');
                    /*******************************Open Edit Interest block***********************/

                    /*******************************Open Edit Number block***********************/
                    numberDefaultVar = self.myNumber();
                    editVariable = self.myNumber().substring(self.myNumber().indexOf("-") + 1, self.myNumber().length);
                    self.temporaryNumber(self.myNumber().substring(self.myNumber().indexOf("-") + 1, self.myNumber().length));
                    if (self.myNumber() == "NO NUMBER")
                    {
                        numberDefaultVar = '';
                        self.temporaryNumber("");
                    }
                    self.temporaryNumber();
                    $('#number-text').addClass('hide');
                    $('#editNumberBox').removeClass('hide');
                    /*******************************Open Edit Number block***********************/
                    $('#edit-all').addClass('hide');
                    $('#submit-all').removeClass('hide');
                    $('#cancel-all').removeClass('hide');
                }

                self.updateAll = function () {
                    self.updateProfile();
                    self.associate_with_infobeans(dateDiffCalender(self.date()));
                    if (isNaN(self.temporaryNumber()))
                    {
                        self.myNumber("+91-" + self.temporaryNumber());
                        self.designation(designationsDefaultVar);
                        self.associate_with_infobeans(associateDefaultVar);
                        self.location(locationDefaultVar);
                        self.skills(skillsDefaultVal);
                        self.projects(projectsDefaultVal);
                        self.interests(interestsDefaultVar);
                        self.primary_project(primaryProjectDefaultVar);
                        self.temporaryNumber(self.myNumber().substring(self.myNumber().indexOf("-") + 1, self.myNumber().length));
                        self.myNumber("+91-" + editVariable);
                        self.temporaryNumber("");
                        self.myNumber(numberDefaultVar);
                    } else
                    {
                        self.myNumber("+91-" + self.temporaryNumber());
                    }
                    $('#designation-text').removeClass('hide');
                    $('#designation-div').addClass('hide');
                    $('#location-text').removeClass('hide');
                    $('#location-div').addClass('hide');
                    $('#skills-text').removeClass('hide');
                    $('#skills').addClass('hide');
                    $('#associate-text').removeClass('hide');
                    $('#associate-div').addClass('hide');
                    $('#primary-project-text').removeClass('hide');
                    $('#primary-project-div').addClass('hide');
                    $('#projects-text').removeClass('hide');
                    $('#projects-div').addClass('hide');
                    $('#interest-text').removeClass('hide');
                    $('#interest-div').addClass('hide');
                    $('#number-text').removeClass('hide');
                    $('#editNumberBox').addClass('hide');
                    $('#edit-all').removeClass('hide');
                    $('#submit-all').addClass('hide');
                    $('#cancel-all').addClass('hide');
                }

                self.allRevert = function () {

                    $('#designation-text').removeClass('hide');
                    $('#designation-div').addClass('hide');
                    $('#location-text').removeClass('hide');
                    $('#location-div').addClass('hide');
                    $('#skills-text').removeClass('hide');
                    $('#skills').addClass('hide');
                    $('#associate-text').removeClass('hide');
                    $('#associate-div').addClass('hide');
                    $('#primary-project-text').removeClass('hide');
                    $('#primary-project-div').addClass('hide');
                    $('#projects-text').removeClass('hide');
                    $('#projects-div').addClass('hide');
                    $('#interest-text').removeClass('hide');
                    $('#interest-div').addClass('hide');
                    $('#number-text').removeClass('hide');
                    $('#editNumberBox').addClass('hide');
                    self.designation(designationsDefaultVar);
                    self.associate_with_infobeans(associateDefaultVar);
                    self.location(locationDefaultVar);
                    self.skills(skillsDefaultVal);
                    self.projects(projectsDefaultVal);
                    self.interests(interestsDefaultVar);
                    self.primary_project(primaryProjectDefaultVar);
                    self.temporaryNumber(self.myNumber().substring(self.myNumber().indexOf("-") + 1, self.myNumber().length));
                    self.myNumber("+91-" + editVariable);
                    self.temporaryNumber("");
                    self.myNumber(numberDefaultVar);
                    $('#edit-all').removeClass('hide');
                    $('#submit-all').addClass('hide');
                    $('#cancel-all').addClass('hide');
                }
                // open reply button
                self.openReply = function (data, event) {
                    $('#' + data['replyBtnId']).fadeOut();
                    $('#' + data['uniqueId']).fadeOut();
                    try {
                        var effectReplyBtn = 'slideOut';
                        if (effectReplyBtn && oj.AnimationUtils[effectReplyBtn])
                        {
                            var jElem = $('#' + data['replyBtnId']);
                            var animateOptions = {'delay': '0ms',
                                'duration': '1000ms',
                                'timingFunction': 'linear'};
                            $.extend(animateOptions, 'all');
                            // Invoke the animation effect method with options
                            oj.AnimationUtils[effectReplyBtn](jElem[0], animateOptions);
                        }
                    } catch (e) {

                    }
                    $('#' + data['uniqueId']).fadeIn();

                }
                // send respond on feedback
                self.replySend = function (data, event) {
                    //feedback respond from (user)
                    var reply_from = data["myId"];
                    //feedbackId 
                    var fid = data['feedbackId'];
                    if (reply_from == data['feedbackFrom']) {
                        var reply_to = data['feedbackto'];
                    } else {
                        var reply_to = data['feedbackfrom'];
                    }
                    // feedback respond system date 
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd
                    }
                    if (mm < 10) {
                        mm = '0' + mm
                    }
                    today = yyyy + '-' + mm + '-' + dd + " ";
                    var responseDesc = $('#' + data['replyInput']);
                    if (responseDesc.val().trim().length == 0) {
                        $('#' + data['replyInput']).parent().parent().next().removeClass('errorVisibilityHide').addClass('errorVisibilityShow');
                        return;
                    }
                    ////////// object for reply add
                    var obj = new Object();
                    obj.from_name = self.myname;
                    obj.description = decodeHtml(responseDesc.val());
                    obj.created_date = today;

                    data['replies'].push(new feedbackRepliesData(0, 0, 0, obj));

                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: addFeedbackResponse,
                        data: {login_user_id: reply_from, feedback_to: reply_to, feedback_desc: responseDesc.val().trim(), feedback_id: fid},
                        success: function () {
                            responseDesc.val("");
                        },
                        beforeSend: function () {
                            $("#respondLoader").removeClass('loaderHide');
                        },
                        complete: function () {
                            $("#respondLoader").addClass('loaderHide');
                        }
                    });


                }
                // close reply input and show reply button
                self.closeReply = function (data, event) {
                    $('#' + data['replyBtnId']).fadeIn();
                    $('#' + data['uniqueId']).fadeOut();
                }
                self.replyInputClick = function (data, event) {
                    $('#' + data['replyInput']).parent().parent().next().removeClass('errorVisibilityShow').addClass('errorVisibilityHide');
                }
            }
            return dialogModel;
        });
