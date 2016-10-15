/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * myTeam module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout'
            , 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojtabs'
            , 'ojs/ojconveyorbelt', 'ojs/ojcomponentcore','ojs/ojmodule'
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
        return member;
    }
    function dataComment(comment1, commenter1, commentDate1) {
        var com = this; // this is for object of this function
        com.comment = comment1;
        com.commenter = commenter1;
        com.commentDate = commentDate1.substring(0, commentDate1.indexOf(' '));
        return com;
    }
    function myTeamContentViewModel(person) {
        var self = this;
        var id = 113; // for now its static data passes for testing.... and replace it with leadId
        self.members = ko.observableArray([]);
        self.data2 = ko.observable();
        self.userId = ko.observable();
        self.noMembers = ko.observable("");
        var user = oj.Model.extend({
            url: "http://dev.parakh.com/parakh-new/v1/index.php/getUserByEmail/" + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: 'parakh-revamp-local-key-2016'},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);
                var TaskRecord = oj.Model.extend({
                    url: "http://dev.parakh.com/parakh-new/v1/index.php/getOtherTeamMembers/" + self.userId()
                });
                var task = new TaskRecord();
                task.fetch({
                    headers: {secret: 'parakh-revamp-local-key-2016'},
                    success: function (res) {
                        var data = task.attributes['data'];
                        for (var counter1 = 0; counter1 < data.length; counter1++) {
                            self.members.push(new teamMember(data[counter1]));
                        }
                        self.data2(self.members());
                        data = data.sort(function (a, b) {
//                    console.log(a['google_name'] +" "+ b['google_name']);
                            return (a['google_name'] > b['google_name']) - (a['google_name'] < b['google_name']);
                        });
                    }
                });
            }
        });
        setTimeout(function () {
            $("#index").ready(function () {
                var AlphaIndexes = [];
                var alphaCounter = 0; // counter for letters present in indexer
                for (var index = 0; index < self.members().length; index++) {
                    if (self.members()[index]['name'].charAt(0) != AlphaIndexes[alphaCounter - 1]) {
                        AlphaIndexes[alphaCounter++] = self.members()[index]['name'].charAt(0);
                    }
                }
                $("#index span").each(function (i, data) {
                    if (i != 0) {
                        for (var z = 0; z < AlphaIndexes.length; z++) {
                            if (AlphaIndexes[z] == $(this).children("a").attr("href")) {
                                $(this).removeClass("hide");
                            }
                        }
                        //console.log(AlphaIndexes[i-1] == $(this).children("a").attr("href"));
                        //$(this).children("a").attr("href");
                    }
                })
            });
        }, 500);

        self.arrangeIndex = function (data, event) {
            if (event.target.tagName == 'A') {
                var value = event.target.href;
                value = value.substr(value.lastIndexOf('/') + 1);
                var temp_data = [];
                self.members([]);
                if (value == "ALL") {
                    self.members([]);
                    self.members(self.data2());
                    if (0 != self.members().length)
                        self.noMembers("");
                } else {
                    var temp_data = [];
                    self.members([]);
                    for (var counter = 0; counter < self.data2().length; counter++) {
                        if (self.data2()[counter]['name'].charAt(0) == value) {
                            self.members.push(self.data2()[counter]);
                        }
                    }

                }

            }
        };
        $("body").on('click', '.rateBuddy', function () {
            //console.log($(this));
            console.log($(this).attr("id"));
            console.log(self.userId());

        });


// modal for view profile
//variables
        self.picture = ko.observable("https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg");
        self.myname12 = ko.observable("SSSS");
        self.plus = ko.observable("1");
        self.minus = ko.observable("1");
        self.memberName = ko.observable("SSS");
        self.fullName = ko.observable("SSW");
        self.memberDesignation = ko.observable("SS");
        self.memberEmail = ko.observable("memberEmail@");
        self.memberNumber = ko.observable("94");
        self.NoCommentsP = ko.observable("94");
        self.commentDataPositive = ko.observableArray([]);
        self.commentDataNegative = ko.observableArray([]);
        self.NoCommentsN = ko.observable("94");
        self.memberId = ko.observable();
        setTimeout(function () {
            $(".view").on("click", function () {
                self.picture("");
                self.myname12("");
                self.plus("");
                self.minus("");
                self.memberName("");
                self.fullName("");
                self.memberDesignation("");
                self.memberEmail("");
                self.memberNumber("");
                self.NoCommentsP("");
                self.commentDataPositive([]);
                self.commentDataNegative([]);
                self.NoCommentsN("");
                self.memberId("");



                $("#open-modal12").fadeIn();
                $("#open-modal12").addClass('open');
                var nm = $(this).attr("myname12").substring(0, $(this).attr("myname12").indexOf(" "));
                self.memberName(nm);
                self.picture($(this).attr("picture1"));
                self.fullName($(this).attr("myname12"));
                self.memberDesignation($(this).attr("memberDesig"));
                self.memberId($(this).attr("memberID"));
                ////////////////////////
                var rate = oj.Model.extend({
                    url: "http://dev.parakh.com/parakh-new/v1/index.php/getRatingByUser/" + self.memberId(),
                    //parse: parseTask
                });
                var rateTask = new rate();
                rateTask.fetch({
                    headers: {secret: 'parakh-revamp-local-key-2016'},
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

                /////////////////////////
            });
            $("#close").on("click", function () {
                $("#open-modal12").fadeOut();
                $("#open-modal12").removeClass('open');
            });
        }, 500);

    }
    return myTeamContentViewModel;
});
