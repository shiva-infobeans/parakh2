/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * members module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojcollectiontabledatasource', 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'ojs/ojcomponentcore', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtable', 'ojs/ojdialog', 'ojs/ojmodel'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    var dateplusArray = [];
    var dateminusArray = [];
    function dataComment(comment1, commenter1, commentDate1, datafor) {
        var com = this; // this is for object of this function
        com.comment = comment1;
        com.shortName = commenter1.replace(/[^A-Z]/g, '');
        com.commenter = commenter1;
        com.commentDate = dateFormatter(commentDate1.substring(0, commentDate1.indexOf(' ')));
        if(datafor){
            if (dateplusArray.indexOf(com.commentDate) == -1) {
                dateplusArray.push(com.commentDate);
            } else
            {
                com.commentDate = '';
            }
        }else
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
        if (data['description'].length > 100) {
            feedbackObj.sComment = data['description'].substring(0, 100) + "...";
        } else {
            feedbackObj.sComment = data['description'];
        }
        feedbackObj.lComment = data['description'];
        feedbackObj.myId = myId;
        feedbackObj.feedbackfrom = data['feedback_from'];
        feedbackObj.name = data['given_by_name'];
        feedbackObj.feedbackId = data['id'];
        feedbackObj.feedbackDescription = data['description'];
        feedbackObj.feedbackdesignation = data['designation'];
        feedbackObj.replies = ko.observableArray();
        feedbackObj.feedbackImage = data['google_picture_link'];
        feedbackObj.uniqueId = "feedback" + data['id'];
        feedbackObj.replyBtnId = "replyBtn" + data['id'];
        // 2nd myId with rtoId change it when view profile page;
        var data_reply = data['reply'];
        for (var c = 0; c < data_reply.length; c++) {
            feedbackObj.replies.push(new feedbackRepliesData(myId, feedbackObj.feedbackfrom, data_reply[c]));
        }
        feedbackObj.feedbackDate = dateFormatter(data['created_date'].substring(0, data['created_date'].indexOf(" ")));
        return feedbackObj;
    }
    function feedbackRepliesData(lid, rtoId, data) {
        var freplies = new Object();
        freplies.login_id = lid;
        freplies.freply_to = rtoId;
        freplies.reply_name = data['from_name'];
        freplies.reply_desc = data['description'];//display desc
        freplies.reply_date = dateFormatter(data['created_date'].substring(0, data['created_date'].indexOf(" ")));// display date
        return freplies;
    }
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    function membersContentViewModel(person) {
        var self = this;
        var windowLocation = window.location;
        var id = windowLocation.search.substring(windowLocation.search.indexOf("=") + 1, windowLocation.search.length);
        self.id = ko.observable(0);
        self.myselfId = ko.observable();
        self.myselfName = ko.observable();
        self.feedbackContent1 = ko.observableArray([]);
        self.feedbackContent2 = ko.observableArray([]);
        this.designation = ko.observable(abc);
        this.NoCommentsP = ko.observable();
        this.NoCommentsN = ko.observable();
        this.commentDataPositive = ko.observableArray([]);
        this.commentDataNegative = ko.observableArray([]);
        this.plus = ko.observable();
        this.minus = ko.observable();
        this.myNumber = ko.observable();
        this.pic = ko.observable();
        this.myname = ko.observable();
        this.email = ko.observable();
        this.mailTo = ko.observable();
        this.UserId = ko.observable();
        this.shortName = ko.observable();
        this.minusSign = ko.observable('-');
        this.plusSign = ko.observable('+');
        self.roleName = ko.observable();
        self.location = ko.observable();
        self.skills = ko.observable();
        self.primary_project = ko.observable();
        self.past_project = ko.observable();
        self.interest = ko.observable();
        self.associated = ko.observable();
        self.myLead = ko.observable();
        self.myManager = ko.observable();

        if (id) {
            self.id(id);
        } else {
            window.location = "rateBuddy.html";
        }
        var abc = "Not Assigned";


//service for id of the user.
        var userIdSearch = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var userRecord = new userIdSearch();
        userRecord.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.roleName(userRecord.attributes['data']['role_name']);
                self.myselfId(userRecord.attributes['data']['id']);
                self.myselfName(userRecord.attributes['data']['google_name']);

                if (self.id() == self.myselfId()) {
                    window.location = "profile.html";
                }

                var getLead = oj.Model.extend(
                        {
                            url: getAllLeads + self.id(),
                        });
                var getmyLead = new getLead();
                getmyLead.fetch({
                    headers: {secret: secret},
                    success: function () {
                        self.myLead(getmyLead['attributes']['data'][0]['manager_id']);
                        self.myManager(getmyLead['attributes']['data'][1]['manager_id']);
                        if (self.myselfId() === self.myLead() || self.myselfId() === self.myManager()) {
                            $('#negetiveTab').show();
                            $('#feedbackTab').show();
                            $("#ulTab").addClass("tabHeight");
                            $("#ulTab").removeClass("tabHeightNew");
                        }
                    }
                });



                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: getAllTeamMembers + userRecord.attributes['data']['id'],
                    data: {},
                    success: function (task) {
                        var data = JSON.parse(task)['data'];
                        var index;
                        for (index = 0; index < data.length; index++) {
                            if (data[index]["id"] == self.id()) {
                                self.UserId(data[index]["id"]);
                                self.myname(data[index]['google_name']);
                                self.shortName(data[index]['google_name'].substring(0, data[index]['google_name'].indexOf(" ")));
                                self.email(data[index]['google_email']);
                                self.mailTo("mailto:"+data[index]['google_email']);
                                self.location(data[index]["location"]);
                                self.skills(data[index]["skills"]);
                                self.primary_project(data[index]["primary_project"]);
                                self.past_project(data[index]["projects"]);
                                self.interest(data[index]["interests"]);
                                self.associated(dateDiffCalender(data[index]["associate_with_infobeans"]));
                                var image = data[index]['google_picture_link'];
                                self.pic(image);
                                self.designation(data[index]['designation']);
                                var num = data[index]['mobile_number'] == "" ? "NO NUMBER" : "+91-" + data[index]['mobile_number'];
                                self.myNumber(num);
                                break;
                            }
                        }
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
                                        var ab = new dataComment(decodeHtml(data[i]['description']), data[i]['given_by_name'], data[i]['created_date'],0);
                                        self.commentDataNegative.push(ab);
                                    } else {
                                        if (data[i]['rating'] == 1)
                                            plus++;
                                        var ab = new dataComment(decodeHtml(data[i]['description']), data[i]['given_by_name'], data[i]['created_date'],1);
                                        self.commentDataPositive.push(ab);
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
                                //feedback for the user
                                var feedbackApi = oj.Model.extend({
                                    url: getFeedbackById + self.UserId()
                                });
                                var apiObj = new feedbackApi();
                                apiObj.fetch({
                                    headers: {secret: secret},
                                    success: function (res) {
                                        var data = res['attributes']['data'];
                                        var index;
                                        for (index = 0; index < data.length; index++) {
                                            if (index % 2 == 0) {
                                                self.feedbackContent1.push(new dataFeedback(self.myselfId(), data[index]));
                                            } else {
                                                self.feedbackContent2.push(new dataFeedback(self.myselfId(), data[index]));
                                            }
                                            if (self.feedbackContent1().length == 0 && self.feedbackContent2().length == 0) {
                                                $("#noFeedback").show();
                                            } else {
                                                $("#noFeedback").hide();
                                            }
                                        }
                                        /// open feedback more option

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

                                        //send the respond to the feedback;
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
                                                            '<span>' + self.myname() + '</span>' +
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
                                                    $("#respondLoader1").removeClass('loaderHide');
                                                },
                                                complete: function () {
                                                    $("#respondLoader1").addClass('loaderHide');
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    return membersContentViewModel;
});