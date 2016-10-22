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
    function dataComment(comment1, commenter1, commentDate1) {
        var com = this; // this is for object of this function
        com.comment = comment1;
        com.commenter = commenter1;
        com.commentDate = commentDate1.substring(0, commentDate1.indexOf(' '));
        return com;
    }
    function dataFeedback(data){
                var feedbackObj = new Object();
                feedbackObj.name = data['given_by_name'];
                feedbackObj.moreLess = "More";
                feedbackObj.feedbackId= data['id'];
                feedbackObj.feedbackDescription= data['description'];
                feedbackObj.feedbackdesignation = "Test";
                feedbackObj.feedbackImage = "http://www.mpi-marburg.mpg.de/employee_images/47122";
                
                feedbackObj.feedbackDate = data['created_date'];
                return feedbackObj;
            }
    function membersContentViewModel(person) {
        var self = this;
        var windowLocation = window.location;
        var id = windowLocation.search.substring(windowLocation.search.indexOf("=") + 1, windowLocation.search.length);
        self.id = ko.observable(0);
        self.feedbackContent = ko.observableArray([]);
        console.log(id);
        if (id) {
            self.id(id);
        } else {
            window.location = "rateBuddy.html";
        }
        var abc = "Not Assigned";
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
        this.UserId = ko.observable();
        this.shortName = ko.observable();
//service for id of the user.
        var userIdSearch = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var userRecord = new userIdSearch();
        userRecord.fetch({
            headers: {secret: secret},
            success: function (res) {
                
                var TaskRecord = oj.Model.extend({
                    url: getAllTeamMembers + userRecord.attributes['data']['id']
                });
                var task = new TaskRecord();
                task.fetch({
                    headers: {secret: secret},
                    success: function () {
                        var data = task.attributes['data'];
                        var index;
                        for (index = 0; index < data.length; index++) {
                            if (data[index]["id"] == self.id()){
                                self.UserId(data[index]["id"]);
                                self.myname(data[index]['google_name']);
                                self.shortName(data[index]['google_name'].substring(0,data[index]['google_name'].indexOf(" ")));
                                self.email(data[index]['google_email']);
                                var image =data[index]['google_picture_link'];
                                self.pic(image);
                                self.designation(data[index]['designation']);
                                var num = data[index]['mobile_number'] == "" ? "NO NUMBER" : "+91-" + data[index]['mobile_number'];
                                self.myNumber(num);
                                break;
                            }
                        }
                        //feedback for the user
                        var feedbackApi = oj.Model.extend({
                            url: getFeedbackById+114
                        });
                        var apiObj = new feedbackApi();
                        apiObj.fetch({
                            headers: {secret: secret},
                            success: function (res) {
                                var data = res['attributes']['data'];
                                for(var index =0; index < data.length;index++){
                                    self.feedbackContent.push(new dataFeedback(data[index]));
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
                            }
                        });
                    }
                });

            }
        });

    }

    return membersContentViewModel;
});