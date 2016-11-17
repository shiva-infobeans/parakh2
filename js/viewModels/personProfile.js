/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * personProfile module
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'ojs/ojcomponentcore', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojmodel'],
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
                feedbackObj.feedbackDate = data['created_date'].substring(0, data['created_date'].indexOf(" "));
                return feedbackObj;
            }
            function feedbackRepliesData(lid, rtoId, fid, data) {
                var freplies = new Object();
                freplies.login_id = lid;
                freplies.freply_to = rtoId;
                freplies.feedback_id = fid;
                freplies.reply_name = data['from_name'];//display name
                freplies.reply_desc = data['description'];//display desc
                freplies.reply_date = data['created_date'].substring(0, data['created_date'].indexOf(" "));// display date
                return freplies;
            }

            function dialogModel(person) {
                var self = this;

                this.pic = person['pic'];
                this.myname = person['name'];
                this.email = person['email'];
                var abc = "Not Assigned";
                this.feedback = ko.observable("GOOD WORK...  keep it up!!");
                this.feedbackContent1 = ko.observableArray([]);
                this.feedbackContent2 = ko.observableArray([]);
                this.commentDataPositive = ko.observableArray([]);
                this.commentDataNegative = ko.observableArray([]);
                self.moreLess = ko.observable("More");
                this.plus = ko.observable();
                this.minus = ko.observable();
                this.myNumber = ko.observable();
                this.NoCommentsN = ko.observable(""); // for negative comment
                this.NoCommentsP = ko.observable(""); // for positive comment
                self.id = ko.observable(0);
                self.mobileError = ko.observable();
                this.successful = ko.observable("S");
                this.successful("");
                this.designation = ko.observable(abc);
                self.desigError = ko.observable();
                this.minusSign = ko.observable('-');
                this.plusSign = ko.observable('+');
                self.selectedTab = ko.observable(0);
                var windowLocation = window.location;
                var id = windowLocation.search.substring(windowLocation.search.indexOf("=") + 1, windowLocation.search.length);

                if (id == "1") {
                    self.selectedTab(1);
                }

                ///////////open modal
                self.tempararyNumber = ko.observable();
                //open feedback close feedback
                setTimeout(function () {
                    $('.openDiv').click(function () {
                        $(this).parent().prev('.open-more').slideToggle();
                        if ($(this).prev().children("span").hasClass("hide")) {
                            $(this).prev().children("span").removeClass("hide");
                            console.log($(this).children("span").children("span").children("i").attr('class'));
                            $(this).children("span").children("span").children("i").addClass("zmdi-caret-up");
                            $(this).children("span").children("span").children("i").removeClass("zmdi-caret-down");
                            $(this).children("span").children("span:nth-child(2)").html("Less");
                        } else {
                            $(this).children("span").children("span:nth-child(2)").html("More");
                            console.log($(this).children("span").children("span").children("i").attr('class'));
                            $(this).children("span").children("span").children("i").removeClass("zmdi-caret-up");
                            $(this).children("span").children("span").children("i").addClass("zmdi-caret-down");
                            $(this).prev().children("span").addClass("hide");
                        }
                    });
                    $('.submitRespond').on('click', function () {
                        var id = $(this).attr("loginUserId");
                        var feedback_to = $(this).attr("feedback_to");
                        var responseDesc = $(this).parent().next("span").children("input");
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
                        var num = task.attributes['data']['mobile_number'] == "" ? "NO NUMBER" : "+91-" + task.attributes['data']['mobile_number'];
                        self.myNumber(num);
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
                                        var ab = new dataComment(data[i]['description'], data[i]['given_by_name'], data[i]['created_date']);
                                        self.commentDataNegative.push(ab);
                                    } else {
                                        if (data[i]['rating'] == 1)
                                            plus++;
                                        var ab = new dataComment(data[i]['description'], data[i]['given_by_name'], data[i]['created_date']);
                                        self.commentDataPositive.push(ab);
                                    }
                                }
                                if (self.commentDataNegative().length == 0) {
                                    self.NoCommentsN("No Ratings Available ...!!");
                                }
                                if (self.commentDataPositive().length == 0) {
                                    self.NoCommentsP("No Ratings Available ...!!");
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
                    self.myNumber(self.tempararyNumber());
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
                    self.tempararyNumber(self.myNumber()); // store number temparary for observable
                    if (self.myNumber() == "NO NUMBER") {
                        self.myNumber("");
                    } else {
                        var numberTrim = self.myNumber();
                        self.myNumber(numberTrim.substr(numberTrim.indexOf("-") + 1), numberTrim.length);
                    }
                };
            }

            return dialogModel;
        });
