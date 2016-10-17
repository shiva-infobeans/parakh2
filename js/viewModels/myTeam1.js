/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * myTeam module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', , 'ojs/ojtabs', 'ojs/ojconveyorbelt'
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
    function leadTeam(data) {
        var myTeam = this;
        myTeam.myName = data['user_name'];
        myTeam.myId = data['user_id'];
        myTeam.myDesign = data['designation'];
        myTeam.myEmail = data['email'];
        myTeam.myPic = data['picture'] == "" ? 'images/warning-icon-24.png' : data['picture'];
        return myTeam;
    }

    function myTeamContentViewModel(person) {
        var self = this;
        self.image = ko.observable();
        self.myname = ko.observable();
        self.myDesignation = ko.observable();
        self.role_name = ko.observable();
        self.teamImage = ko.observable();
        self.teamName = ko.observable();
        self.teamDesig = ko.observable();
        self.data1 = ko.observableArray([]);
        //modal for rating +1
        setTimeout(function () {
            self.handleOpen = $(".star").click(function () {
                $("#modalDialog1").ojDialog("open");
            });

            self.handleOKClose = $("#okButton").click(function () {
//                $("#modalDialog1").ojDialog("close");
            });
        }, 500);

        //modal for rating +1 or -1 to team members
        setTimeout(function () {
            self.handleOpen = $(".starTeam").click(function () {
                $("#modalDialog2").ojDialog("open");
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog2").ojDialog("close");
            });
        }, 500);


        this.value = ko.observable();

//lead team 

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
        setTimeout(function () {
            $("#index1").ready(function () {
                var AlphaIndexes = [];
                var alphaCounter = 0; // counter for letters present in indexer
                for (var index = 0; index < self.myTeam().length; index++) {

                    if (self.myTeam()[index]['myName'].charAt(0) != AlphaIndexes[alphaCounter - 1]) {
                        AlphaIndexes[alphaCounter++] = self.myTeam()[index]['myName'].charAt(0);
                    }
                }
                $("#index1 span").each(function (i, data) {
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

        var lead_id = 5; //static id for team lead 
        self.myTeam = ko.observableArray([]);
        self.myId = ko.observable();
        self.desc = ko.observable();
        self.textError = ko.observable();
        self.lead_id = ko.observable(5);
        var teamUser = oj.Model.extend({
            url: "http://dev.parakh.com/parakh-new/v1/index.php/getUserByLead/" + lead_id
        });
        var getUser = new teamUser();
        getUser.fetch({
            headers: {secret: 'parakh-revamp-local-key-2016'},
            success: function () {
//                     console.log(getUser['attributes']['data']);
                var data = getUser.attributes['data'];
                data = data.sort(function (a, b) {
//                   console.log(a['google_name'] +" "+ b['google_name']);
                    return (a['user_name'] > b['user_name']) - (a['user_name'] < b['user_name']);
                });
                for (var counter1 = 0; counter1 < data.length; counter1++) {
                    self.myTeam.push(new leadTeam(data[counter1]));
                }
                self.data1(self.myTeam());

            }

        });

//   var id = 113; // for now its static data passes for testing.... and replace it with leadId
        self.members = ko.observableArray([]);
        self.data2 = ko.observable();
        self.userId = ko.observable();
        self.name = ko.observable();
        self.for_id = ko.observable();
        self.role_name = ko.observable();
//     self.leadId = ko.observable();
        self.noMembers = ko.observable("");
        self.desc = ko.observable();
        self.textError = ko.observable();
        var user = oj.Model.extend({
            url: "http://dev.parakh.com/parakh-new/v1/index.php/getUserByEmail/" + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: 'parakh-revamp-local-key-2016'},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);
                console.log(res['attributes']['data']['role_name']);

                var TaskRecord = oj.Model.extend({
                    url: "http://dev.parakh.com/parakh-new/v1/index.php/getOtherTeamMembers/" + self.userId()
                });
                var task = new TaskRecord();
                task.fetch({
                    headers: {secret: 'parakh-revamp-local-key-2016'},
                    success: function (res) {
//                        console.log('userId');
                        var data = task.attributes['data'];
                        data = data.sort(function (a, b) {
//                   console.log(a['google_name'] +" "+ b['google_name']);
                            return (a['google_name'] > b['google_name']) - (a['google_name'] < b['google_name']);
                        });
                        for (var counter1 = 0; counter1 < data.length; counter1++) {
                            self.members.push(new teamMember(data[counter1]));
                        }
                        self.data2(self.members());

                    }
                });
            }
        });
        self.arrangeIndex = function (data, event) {
            if (event.target.tagName == 'A') {
                var value = event.target.href;
                value = value.substr(value.lastIndexOf('/') + 1);
                var temp_data = [];
                self.members([]);
                if (value == "ALL") {
                    self.members([]);
                    self.members(self.data2());
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
            setTimeout(function () {
                self.handleOpen = $(".star").click(function () {
                    $("#modalDialog1").ojDialog("open");
                });
                self.handleOKClose = $("#okButton").click(function () {
                    $("#modalDialog1").ojDialog("close");
                });
            }, 500);
        };
        self.arrangeIndex1 = function (data, event) {
            if (event.target.tagName == 'A') {
                var value = event.target.href;

                value = value.substr(value.lastIndexOf('/') + 1);
                var temp_data = [];

                self.myTeam([]);
                if (value == "ALL") {
                    self.myTeam([]);
                    self.myTeam(self.data1());
                } else {
                    var temp_data = [];
                    self.members([]);
                    for (var counter = 0; counter < self.data1().length; counter++) {
                        if (self.data1()[counter]['myName'].charAt(0) == value) {
                            self.myTeam.push(self.data1()[counter]);
                        }
                    }
                }
            }
            setTimeout(function () {
                self.handleOpen = $(".starTeam").click(function () {
                    $("#modalDialog2").ojDialog("open");
                });

                self.handleOKClose = $("#okButton").click(function () {
                    $("#modalDialog2").ojDialog("close");
                });
            }, 500);
        };

        $("body").on('click', '.rateBuddy', function () {
            self.for_id($(this).attr("id"));
            console.log(self.userId());
            console.log(self.for_id());

            self.image($(this).attr("image"));
            self.myname($(this).attr("myname"));
            self.myDesignation($(this).attr("myDesignation"));
//    var buddyDetails =$(this).parents().eq(2).siblings().children().children(2,3);
//     console.log('buddyDetails'+ buddyDetails[0]['attributes'][1]['nodeValue']); 
        });
        //rate +1 from team member to other team member in ratebuddy page modal
        self.submitModal = function () {
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please Provide a reason for your rating");
                return false;
            } else {

                $.ajax({
                    headers: {secret: 'parakh-revamp-local-key-2016'},
                    method: 'POST',
                    url: 'http://dev.parakh.com/parakh-new/v1/index.php/rateOtherMember',
                    data: {user_id: self.userId(), for_id: self.for_id(), rating: (1), desc: self.desc()},
                    success: function () {
                        console.log('ratingDone');
                        $("#modalDialog1").ojDialog("close");
                    }
                });
            }
        }
//        +1/-1 from team lead/manager 
        $("body").on('click', '.rateMyTeam', function () {
            console.log(self.lead_id());
            self.teamImage($(this).attr("teamImage"));
            self.myId($(this).attr("myTeamId"));
            console.log(self.myId());
            self.teamName($(this).attr("teamName"));
            self.teamDesig($(this).attr("teamDesig"));

        });
        self.p = ko.observable(1);

        // +1 rating on green button 
        self.image1 = ko.observable(src = "css/images/green-button.png")
        self.image2 = ko.observable(src = "css/images/disable.png");
        this.plusOne = function () {
            self.p(1);
            self.image1("css/images/green-button.png")
            self.image2("css/images/disable.png");
        };
        //-1 ratig on red button image

        this.minusOne = function () {
            self.p(0);
            self.image1("css/images/disable.png")
            self.image2("css/images/red-button.png");

        };
        // default +1 on submit button 
        this.leadSubmit = function () {
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please Provide a reason for your rating");
                return false;
            } else {
                $.ajax({
                    headers: {secret: 'parakh-revamp-local-key-2016'},
                    method: 'POST',
                    url: 'http://dev.parakh.com/parakh-new/v1/index.php/addRating',
                    data: {from_id: self.lead_id(), to_id: self.myId(), rating: self.p(), desc: self.desc()},
                    success: function () {
                        console.log('ratingDone');
                        $("#modalDialog2").ojDialog("close");
                    }
                });
            }
            console.log(self.p());
        };
    }
    return myTeamContentViewModel;
});



