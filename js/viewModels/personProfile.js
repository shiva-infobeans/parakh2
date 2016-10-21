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
                var com = this; // this is for object of this function
                com.comment = comment1;
                com.commenter = commenter1;
                com.commentDate = commentDate1.substring(0, commentDate1.indexOf(' '));
                return com;
            }
            function dataFeedback(data) {
                var feedbackObj = new Object();
                feedbackObj.name = data['given_by_name'];
                feedbackObj.moreLess = "More";
                feedbackObj.feedbackId = data['id'];
                feedbackObj.feedbackDescription = data['description'];
                feedbackObj.feedbackdesignation = "Test";
                feedbackObj.feedbackImage = "http://www.mpi-marburg.mpg.de/employee_images/47122";

                feedbackObj.feedbackDate = data['created_date'];
                return feedbackObj;
            }
            function dialogModel(person) {
                var self = this;
                this.feedback = ko.observable("GOOD WORK...  keep it up!!");
                this.feedbackContent = ko.observableArray([]);
                this.pic = person['pic'];
                this.commentDataPositive = ko.observableArray([]);
                this.commentDataNegative = ko.observableArray([]);
                self.moreLess = ko.observable("More");
                this.plus = ko.observable();
                this.minus = ko.observable();
                this.myNumber = ko.observable();
                this.NoCommentsN = ko.observable(""); // for negative comment
                this.NoCommentsP = ko.observable(""); // for positive comment
                this.myname = person['name'];
                this.email = person['email'];
                var abc = "Not Assigned";
                self.id = ko.observable(0);
                self.mobileError = ko.observable();
                this.successful = ko.observable("S");
                this.successful("");
                this.designation = ko.observable(abc);
                self.desigError = ko.observable();
                ///////////open modal
                self.tempararyNumber = ko.observable();
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
                self.closeModal = function () {
                    $("#open-modal").fadeOut();
                    $("#open-modal").removeClass('open');
                    self.myNumber(self.tempararyNumber());
                };
                //////////////////// edit profile page
                self.buttonClick = function () {
                    if (self.designation() == '' || self.designation() == null) {//validation for input not null or not empty
                        //console.log('should not be null : 123'); //show error message here!!!!
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
                        self.designation(abc);
                        var num = task.attributes['data']['mobile_number'] == "" ? "NO NUMBER" : "+91-" + task.attributes['data']['mobile_number'];
                        self.myNumber(num);
                        //feedback for the user
//                        var feedbackApi = oj.Model.extend({
//                            url: getFeedbackById+114
//                        });
//                        var apiObj = new feedbackApi();
//                        apiObj.fetch({
//                            headers: {secret: secret},
//                            success: function (res) {
//                                var data = res['attributes']['data'];
//                                for(var index =0; index < data.length;index++){
//                                    self.feedbackContent.push(new dataFeedback(data[index]));
//                                }
//                            }
//                        });
//                        
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
                            }
                        });
                    }
                });
                setTimeout(function () {

                    //(.more-feedback);
                    console.log($(this).parent().attr("class"));
//                            $(this).click(function () {
//                        $(this).slideToggle("slow", function () {
//                            // Animation complete.
//                        });
//                    });

                    $(".more-feedback").on('click', function () {
                        if ($(this).parent().parent().prev(".transition").hasClass("open-more")) {
                            $(this).parent().parent().prev(".transition").removeClass("open-more");
                            $(this).parent().parent().prev(".transition").children(":first").addClass("hide");
                            $(this).parent().children(":first-child").addClass("hide");
                            $(this).parent().children(":nth-child(2)").addClass("hide");
                            $(this).val("Less");
                        } else {
                            $(this).parent().parent().prev(".transition").children(":first").removeClass("hide");
                            $(this).parent().parent().prev(".transition").addClass("open-more");
                            $(this).parent().parent().prev(".transition").children(":first").attr("class");
                            $(this).parent().children(":first-child").removeClass("hide");
                            $(this).parent().children(":nth-child(2)").removeClass("hide");
                            $(this).val("More");
                        }
                    });
                }, 500);

            }
            return dialogModel;
        });
