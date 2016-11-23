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
            function dataComment(comment1, commenter1, commentDate1) {
                commentDate1 = new Date(commentDate1);
                //commentDate1 = commentDate1.toDateString();
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                var com = this; // this is for object of this function
                com.comment = comment1;
                com.commenter = commenter1;
                com.commentDate = commentDate1.getDate() + ' ' + monthNames[commentDate1.getMonth()] + ' ' + commentDate1.getFullYear();
                return com;
            }
            function dateDiffCalender(Date1) {
                user_date = Date.parse(Date1);
                today_date = new Date();
                if(Date1!=''){
                    diff_date =  today_date - user_date;

                    num_years = diff_date/31536000000;
                    num_months = (diff_date % 31536000000)/2628000000;
                    num_days = ((diff_date % 31536000000) % 2628000000)/86400000;
                    if(Math.floor(num_years) > 1)
                    {
                        num_years = Math.floor(num_years)+" Years";
                    }else
                    {
                        num_years = Math.floor(num_years)+" Year";
                    }

                    if(Math.floor(num_months) > 1)
                    {
                        num_months = Math.floor(num_months)+" Months";
                    }else
                    {
                        num_months = Math.floor(num_months)+" Month";
                    }
                    return num_years+" "+num_months;
                }else
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
                feedbackObj.myId = myId;
                feedbackObj.feedbackfrom = data['feedback_from'];
                feedbackObj.name = data['given_by_name'];
                feedbackObj.feedbackId = data['id'];
                feedbackObj.feedbackDescription = data['description'];
                feedbackObj.feedbackdesignation = data['designation'];
                feedbackObj.replies = ko.observableArray();
                feedbackObj.feedbackImage = data['google_picture_link'];
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
                freplies.reply_desc = data['description'];//display desc
                freplies.reply_date = dateFormatter(data['created_date'].substring(0, data['created_date'].indexOf(" ")));// display date
                return freplies;
            }

            function dialogModel(person) {
                var self = this;

                this.pic = person['pic'];
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
                var editVariable;
                var windowLocation = window.location;
                var id = windowLocation.search.substring(windowLocation.search.indexOf("=") + 1, windowLocation.search.length);

                if (id == "1") {
                    self.selectedTab(1);
                }

                ///////////open modal

                //open feedback close feedback
                setTimeout(function () {
                    $('.openDiv').click(function () {
                        $(this).parent().prev('.open-more').slideToggle();
                        if ($(this).prev().children("span").hasClass("hide")) {
                            $(this).prev().children("span").removeClass("hide");
                            $(this).children("span").children("span").children("i").addClass("zmdi-caret-up");
                            $(this).children("span").children("span").children("i").removeClass("zmdi-caret-down");
                            $(this).children("span").children("span:nth-child(2)").html("Less");
                        } else {
                            $(this).children("span").children("span:nth-child(2)").html("More");
                            $(this).children("span").children("span").children("i").removeClass("zmdi-caret-up");
                            $(this).children("span").children("span").children("i").addClass("zmdi-caret-down");
                            $(this).prev().children("span").addClass("hide");
                        }
                    });
                    $('.submitRespond').on('click', function () {
                        var id = $(this).attr("loginUserId");
                        var feedback_to = $(this).attr("feedback_to");
                        var responseDesc = $(this).parent().next("span").children("input");
						if(responseDesc.val().length == 0) {
                                               return;
                                           }
                        var fid = $(this).attr("feedbackId");
                        var appendChild = this;
                        var sysDate = new Date();
                        var dateString = sysDate.toJSON().toString().substr(0, 10);

                        $.ajax({
                            headers: {secret: secret},
                            method: 'POST',
                            url: addFeedbackResponse,
                            data: {login_user_id: id, feedback_to: feedback_to, feedback_desc: responseDesc.val(), feedback_id: fid},
                            success: function () {
                                $(appendChild).parent().parent().parent().prev().append(
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
                            }
                        });
                    });

                }, 500);

                //update profile submit button ajax call
                self.updateProfile = function () {
                    // if (self.desc() == '' || self.desc() == null) {
                    //     self.textError("Please provide a reason for your request.");
                    //     return false;
                    // }
                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: updateProfile,
                        data: {user_id: self.id(), desc: self.designation(), location: self.location(), skills: self.skills(),primary_project: self.primary_project(), date: self.date(), projects: self.projects(), interests: self.interests(), mob: self.myNumber()},
                        success: function (res) {
                            response = jQuery.parseJSON( res );
                            // self.desc('');
                            // self.textError('');
                            $("#successful").show();
                            if(response.error=="true")
                            {
                                self.successful(response.data.error);
                            }else
                            {
                                self.successful("Profile Updated Successfully");
                            }
                            setTimeout(function () {
                                $("#successful").hide();
                                //self.sucessMsg("");
                            }, 3000);
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
                        var num = task.attributes['data']['mobile_number'] == "" ? "NO NUMBER" : "+91-" + task.attributes['data']['mobile_number'].replace("+91-","");
                        self.myNumber(num);
                        self.skills(task.attributes['data']['skills']);
                        self.location(task.attributes['data']['location']);
                        if (task.attributes['data']['interests'].length != 0) {
                            interest = task.attributes['data']['interests'].split(",");
                            for(k=0;k<interest.length;k++){
                                self.interests(interest);
                            }
                        } else {
                            self.interests([]);
                        }
                        if (task.attributes['data']['projects'].length != 0) {
                            project = task.attributes['data']['projects'].split(",");
                            for(k=0;k<project.length;k++){
                                self.projects(project);
                            }
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
                                    if (index % 2 == 0) {
                                        self.feedbackContent1.push(new dataFeedback(self.id(), data[index]));
                                    } else {
                                        self.feedbackContent2.push(new dataFeedback(self.id(), data[index]));
                                    }
                                }
								if (self.feedbackContent1().length == 0 && self.feedbackContent2().length == 0) {
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
                                        var temporaryComment = new dataComment(data[i]['description'], data[i]['given_by_name'], data[i]['created_date']);
                                        self.commentDataNegative.push(temporaryComment);
                                    } else {
                                        if (data[i]['rating'] == 1)
                                            plus++;
                                        var temporaryComment = new dataComment(data[i]['description'], data[i]['given_by_name'], data[i]['created_date']);
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
								   if(self.commentDataPositive().length != 0){
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

                self.openModal = function () {
                    $("#open-modal").fadeIn();
                    $("#open-modal").addClass('open');
                    self.temporaryNumber(self.myNumber()); // store number temparary for observable
                    if (self.myNumber() == "NO NUMBER") {
                        self.myNumber("");
                    } else {
                        var numberTrim = self.myNumber();
                        self.myNumber(numberTrim.substr(numberTrim.indexOf("-") + 1), numberTrim.length);
                    }
                };
                // edit Associate with infobeans
                var associateDefaultVar;
                self.openDate = function () {
                    associateDefaultVar = $('#associate-text').attr('defaultDate');
                    self.associate_with_infobeans(associateDefaultVar);
                    $('#associate-text').addClass('hide');
                    $('#associate-div').removeClass('hide');
                    $('#edit-associate').addClass('hide');
                    $('#submit-associate').removeClass('hide');
                    $('#cancel-associate').removeClass('hide');
                    
                }
                self.updateDate = function () {
                    //ajax call here
                    self.updateProfile();
                    self.associate_with_infobeans(dateDiffCalender(self.date()));

                    $('#associate-text').removeClass('hide');
                    $('#associate-div').addClass('hide');
                    $('#edit-associate').removeClass('hide');
                    $('#submit-associate').addClass('hide');
                    $('#cancel-associate').addClass('hide');
                }
                self.dateRevert = function () {
                    self.associate_with_infobeans(associateDefaultVar);
                    $('#associate-text').removeClass('hide');
                    $('#associate-div').addClass('hide');
                    $('#edit-associate').removeClass('hide');
                    $('#submit-associate').addClass('hide');
                    $('#cancel-associate').addClass('hide');   
                }


                // edit designation
                var designationsDefaultVar;
                self.openDesignations = function () {
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
                        $('#edit-designation').addClass('hide');
                        $('#submit-designation').removeClass('hide');
                        $('#cancel-designation').removeClass('hide');
                }
                self.updateDesignations = function () {
                    //ajax call here
                    self.updateProfile();
                    $('#designation-text').removeClass('hide');
                    $('#designation-div').addClass('hide');
                    $('#edit-designation').removeClass('hide');
                    $('#submit-designation').addClass('hide');
                    $('#cancel-designation').addClass('hide');
                }
                self.designationsRevert = function () {
                    // self.designationOptions(editVariable);
                    $('#designation-text').removeClass('hide');
                    $('#designation-div').addClass('hide');
                    $('#edit-designation').removeClass('hide');
                    $('#submit-designation').addClass('hide');
                    $('#cancel-designation').addClass('hide');
                    self.designation(designationsDefaultVar);

                }

                // edit location
                self.openLocation = function () {
                    locationDefaultVar = self.location();
                    $('#location-text').addClass('hide');
                    $('#location-div').removeClass('hide');
                    $('#edit-location').addClass('hide');
                    $('#submit-location').removeClass('hide');
                    $('#cancel-location').removeClass('hide');
                }
                self.updateLocation = function () {
                    //ajax call here
                    self.updateProfile();
                    $('#location-text').removeClass('hide');
                    $('#location-div').addClass('hide');
                    $('#edit-location').removeClass('hide');
                    $('#submit-location').addClass('hide');
                    $('#cancel-location').addClass('hide'); 
                }
                self.locationRevert = function () {
                    $('#location-text').removeClass('hide');
                    $('#location-div').addClass('hide');
                    $('#edit-location').removeClass('hide');
                    $('#submit-location').addClass('hide');
                    $('#cancel-location').addClass('hide'); 
                    self.location(locationDefaultVar);  
                }

                // edit skills
                var skillsDefaultVal;
                self.openSkills = function () {
                    skillsDefaultVal = self.skills();
                    $('#skills-text').addClass('hide');
                    $('#skills').removeClass('hide');
                    $('#edit-skills').addClass('hide');
                    $('#submit-skills').removeClass('hide');
                    $('#cancel-skills').removeClass('hide');
                }
                self.updateSkills = function () {
                    //ajax call here
                    self.updateProfile();
                    $('#skills-text').removeClass('hide');
                    $('#skills').addClass('hide');
                    $('#edit-skills').removeClass('hide');
                    $('#submit-skills').addClass('hide');
                    $('#cancel-skills').addClass('hide'); 
                }
                self.skillsRevert = function () {
                    $('#skills-text').removeClass('hide');
                    $('#skills').addClass('hide');
                    $('#edit-skills').removeClass('hide');
                    $('#submit-skills').addClass('hide');
                    $('#cancel-skills').addClass('hide'); 
                    self.skills(skillsDefaultVal);  
                }

                // edit projects
                var projectsDefaultVal;
                self.openProjects = function () {
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
                    $('#edit-projects').addClass('hide');
                    $('#submit-projects').removeClass('hide');
                    $('#cancel-projects').removeClass('hide');
                }
                self.updateProjects = function () {
                    //ajax call here
                    self.updateProfile();
                    $('#projects-text').removeClass('hide');
                    $('#projects-div').addClass('hide');
                    $('#edit-projects').removeClass('hide');
                    $('#submit-projects').addClass('hide');
                    $('#cancel-projects').addClass('hide');
                }
                self.projectsRevert = function () {
                    self.projectOptions(editVariable);
                    $('#projects-text').removeClass('hide');
                    $('#projects-div').addClass('hide');
                    $('#edit-projects').removeClass('hide');
                    $('#submit-projects').addClass('hide');
                    $('#cancel-projects').addClass('hide');
                    self.projects(projectsDefaultVal);
                }

                // edit interests
                var DefaultInterestsVar;
                self.openInterest = function () {
                    DefaultInterestsVar = self.interests();
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
                    // var interests = oj.Model.extend({
                    //     url: getAllInterests,
                    // });
                    // var interestTask = new interests();
                    // interestTask.fetch({
                    //     headers: {secret: secret},
                    //     success: function (res) {
                    //         for (var c = 0; c < res['attributes']['data'].length; c++) {
                    //             var obj = new Object();
                    //             obj.name = res['attributes']['data'][c]['interest'];
                    //             self.interestsOptions.push(obj);
                    //         }
                    //         $('#selectInterests').ojSelect("refresh");
                    //     }
                    // });
                    $('#interest-text').addClass('hide');
                    $('#interest-div').removeClass('hide');
                    $('#edit-interest').addClass('hide');
                    $('#submit-interest').removeClass('hide');
                    $('#cancel-interest').removeClass('hide');
                }
                self.updateInterest = function () {
                    //ajax call here
                    self.updateProfile();
                    $('#interest-text').removeClass('hide');
                    $('#interest-div').addClass('hide');
                    $('#edit-interest').removeClass('hide');
                    $('#submit-interest').addClass('hide');
                    $('#cancel-interest').addClass('hide');
                }
                self.interestRevert = function () {
                    self.interests(editVariable);
                    $('#interest-text').removeClass('hide');
                    $('#interest-div').addClass('hide');
                    $('#edit-interest').removeClass('hide');
                    $('#submit-interest').addClass('hide');
                    $('#cancel-interest').addClass('hide');
                    self.interests(DefaultInterestsVar);
                }

                // edit primary project here......
                var DefaultPrimaryProjectVar;
                self.openPrimaryProject = function () {
                    DefaultPrimaryProjectVar = self.primary_project();
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
                        }
                    });
                        $('#primary-project-text').addClass('hide');
                        $('#primary-project-div').removeClass('hide');
                        $('#edit-primary-project').addClass('hide');
                        $('#submit-primary-project').removeClass('hide');
                        $('#cancel-primary-project').removeClass('hide');
                }
                self.updatePrimaryProject = function () {
                    //ajax call here
                    self.updateProfile();
                    $('#primary-project-text').removeClass('hide');
                    $('#primary-project-div').addClass('hide');
                    $('#edit-primary-project').removeClass('hide');
                    $('#submit-primary-project').addClass('hide');
                    $('#cancel-primary-project').addClass('hide');
                }
                self.primaryProjectRevert = function () {
                    $('#primary-project-text').removeClass('hide');
                    $('#primary-project-div').addClass('hide');
                    $('#edit-primary-project').removeClass('hide');
                    $('#submit-primary-project').addClass('hide');
                    $('#cancel-primary-project').addClass('hide');
                    self.primary_project(DefaultPrimaryProjectVar);
                }

                // edit number here......
                var DefaultNumberVar;
                self.openNumber = function () {
                    DefaultNumberVar = self.myNumber();
                    editVariable = self.myNumber().substring(self.myNumber().indexOf("-") + 1, self.myNumber().length);
                    self.temporaryNumber(self.myNumber().substring(self.myNumber().indexOf("-") + 1, self.myNumber().length));
                    self.temporaryNumber();
                    $('#number-text').addClass('hide');
                    $('#editNumberBox').removeClass('hide');
                    $('#edit-number').addClass('hide');
                    $('#submit-number').removeClass('hide');
                    $('#cancel-number').removeClass('hide');
                }
                self.updateNumber = function () {
                    self.myNumber("+91-" + self.temporaryNumber());
                    if(isNaN(self.temporaryNumber()))
                    {
                        self.myNumber(DefaultNumberVar);
                    }
                    //ajax call here
                    self.updateProfile();
                    $('#number-text').removeClass('hide');
                    $('#editNumberBox').addClass('hide');
                    $('#edit-number').removeClass('hide');
                    $('#submit-number').addClass('hide');
                    $('#cancel-number').addClass('hide');
                }
                self.numberEditRevert = function () {
                    //$("#editNumberBox").hide();
                    self.temporaryNumber(self.myNumber().substring(self.myNumber().indexOf("-") + 1, self.myNumber().length));
                    self.myNumber("+91-" + editVariable);
                    self.temporaryNumber("");
                    $('#number-text').removeClass('hide');
                    $('#editNumberBox').addClass('hide');
                    $('#edit-number').removeClass('hide');
                    $('#submit-number').addClass('hide');
                    $('#cancel-number').addClass('hide');
                    self.myNumber(DefaultNumberVar);
                }
            }

            return dialogModel;
        });
