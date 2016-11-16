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
        getOtherTeamMembers + data['id'];
        member.plus = data['pluscount'];
        member.minus = data['minuscount'];
        return member;
    }
    function leadTeam(data) {
        var myTeam = this;
        myTeam.myName = data['user_name'];
        myTeam.myId = data['user_id'];
        myTeam.myDesign = data['designation'];
        myTeam.myEmail = data['email'];
        myTeam.myPic = data['picture'] == "" ? 'images/warning-icon-24.png' : data['picture'];
        myTeam.plus = data['pluscount'];
        myTeam.minus = data['minuscount'];
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
        this.value = ko.observable();
        //  var lead_id = 5; //static id for team lead 
        self.myTeam = ko.observableArray([]);
        self.myId = ko.observable();
        self.desc = ko.observable();
        self.textError = ko.observable();
        self.lead_id = ko.observable(); //static
        self.members = ko.observableArray([]);
        self.data2 = ko.observable();
        self.userId = ko.observable();
        self.name = ko.observable();
        self.for_id = ko.observable();
        self.role_name = ko.observable();
        self.desc = ko.observable();
        self.textError = ko.observable();
        self.sucessMsg = ko.observable();
        
        //user
        var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);
                self.lead_id(res['attributes']['data']['id']);
                self.role_name(res['attributes']['data']['role_name']);

                if (self.role_name() === 'Team Member') {

                    $('#tabs ul li:last-child').hide();

                } else {

                    $('#tabs ul li:last-child').addClass('abc').show();
                    //lead id user
                    var teamUser = oj.Model.extend({
                        url: getUserByLead + self.lead_id(),
                    });
                    var getUser = new teamUser();
                    getUser.fetch({
                        headers: {secret: secret},
                        success: function () {
                            var data = getUser.attributes['data'];
                            data = data.sort(function (a, b) {
                                return (a['user_name'] > b['user_name']) - (a['user_name'] < b['user_name']);
                            });
                            for (var counter1 = 0; counter1 < data.length; counter1++) {
                                self.myTeam.push(new leadTeam(data[counter1]));
                            }
                            self.data1(self.myTeam());
                        }
                    });


                }
                var TaskRecord = oj.Model.extend({
                    url: getOtherTeamMembers + self.userId()
                });
                var task = new TaskRecord();
                task.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        var data = task.attributes['data'];
                        data = data.sort(function (a, b) {
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
                $(".viewProfile").on('click', function () {
                    console.log($(this).attr("myTeamId"));
                    var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
                    console.log(link);
                    window.location = link;
                });

            }
            // feedback...
            self.handleOpen = $(".feedbackBuddy").click(function () {
                $("#modalDialog8").ojDialog("open");
                self.desc('');
                self.textError('');
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog8").ojDialog("close");
            });
            // feedbackLead...
            self.handleOpen = $(".feedbackBuddyLead").click(function () {
                $("#modalDialog8").ojDialog("open");
                self.desc('');
                self.textError('');
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog8").ojDialog("close");
            });
            self.handleOpen = $(".feedbackBuddyLead").click(function () {
                $("#modalDialog8").ojDialog("open");
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog8").ojDialog("close");
            });
            //rateBuddy...
            self.handleOpen = $(".star").click(function () {
                $("#modalDialog1").ojDialog("open");
                self.desc('');
                self.textError('');
            });
            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog1").ojDialog("close");
            });


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
                // feedback...
                self.handleOpen = $(".feedbackBuddy").click(function () {
                    $("#modalDialog8").ojDialog("open");
                    self.desc('');
                    self.textError('');
                });

                self.handleOKClose = $("#okButton").click(function () {
                    $("#modalDialog8").ojDialog("close");
                });
                // feedbackLead...
                self.handleOpen = $(".feedbackBuddyLead").click(function () {
                    $("#modalDialog8").ojDialog("open");
                    self.desc('');
                    self.textError('');
                });

                self.handleOKClose = $("#okButton").click(function () {
                    $("#modalDialog8").ojDialog("close");
                });
                //view profile...
                $(".viewProfile").on('click', function () {
                    var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
                    window.location = link;
                });
            }
            $(".viewProfile").on('click', function () {
                var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
                window.location = link;
            });
            self.handleOpen = $(".starTeam").click(function () {
                $("#modalDialog2").ojDialog("open");
                self.desc('');
                self.textError('');
                self.p(1);
                self.image1("css/images/green-button.png")
                self.image2("css/images/disable.png");
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog2").ojDialog("close");
            });
        };
        //rateBuddy
        $("body").on('click', '.rateBuddy', function () {
            self.for_id($(this).attr("id"));
            self.image($(this).attr("image"));
            self.myname($(this).attr("myname"));
            self.myDesignation($(this).attr("myDesignation"));
        });
        //feedbackLead
        $("body").on('click', '.feedbackBuddyLead', function () {
            self.for_id($(this).attr("myTeamId"));
            self.image($(this).attr("teamImage"));
            self.myname($(this).attr("teamName"));
            self.myDesignation($(this).attr("teamDesig"));
        });
        //feedback...
        $("body").on('click', '.feedbackBuddy', function () {
            self.for_id($(this).attr("id"));
            self.image($(this).attr("image"));
            self.myname($(this).attr("myname"));
            self.myDesignation($(this).attr("myDesignation"));
        });
        //submit for rate buddy
        self.submitModal = function () {
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please Provide a reason for your rating");
                return false;
            } else {

                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: rateOtherMember,
                    data: {user_id: self.userId(), for_id: self.for_id(), rating: (1), desc: self.desc()},
                    success: function () {
                        $("#modalDialog1").ojDialog("close");
                        $("#sucess").show();
                        self.sucessMsg("Member rated successfully!");
                        setTimeout(function () {
                            $("#sucess").hide();
                            self.sucessMsg("");
                        }, 3000);
                    }
                });
            }
        }
        //submit for feedback
        self.submitFeedback = function () {
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please Provide your feedback");
                return false;
            } else {
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: addFeedback,
                    data: {feedback_from: self.userId(), feedback_to: self.for_id(), feedback_description: self.desc()},
                    success: function () {
                        $("#modalDialog8").ojDialog("close");
                        self.sucessMsg("Feedback is sent!");
                        setTimeout(function () {
                            $("#sucess").hide();
                            self.sucessMsg("");
                        }, 3000);
                    }
                });
            }
        }
//        +1/-1 from team lead/manager 
        $("body").on('click', '.rateMyTeam', function () {
            self.teamImage($(this).attr("teamImage"));
            self.myId($(this).attr("myTeamId"));
            self.teamName($(this).attr("teamName"));
            self.teamDesig($(this).attr("teamDesig"));

        });

        //feedback...
        $("body").on('click', '.feedbackBuddy', function () {
            self.teamImage($(this).attr("teamImage"));
            self.myId($(this).attr("myTeamId"));
            self.teamName($(this).attr("teamName"));
            self.teamDesig($(this).attr("teamDesig"));

        });
        //feedbackLead
        $("body").on('click', '.feedbackBuddyLead', function () {
            self.teamImage($(this).attr("teamImage"));
            self.myId($(this).attr("myTeamId"));
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
                    headers: {secret: secret},
                    method: 'POST',
                    url: addRating,
                    data: {from_id: self.lead_id(), to_id: self.myId(), rating: self.p(), desc: self.desc()},
                    success: function () {
                        $("#modalDialog2").ojDialog("close");
                        self.sucessMsg("Member rated successfully!");
                        setTimeout(function () {
                            $("#sucess").hide();
                            self.sucessMsg("");
                        }, 3000);
                    }
                });
            }
        };
        //lead team 
        setTimeout(function () {
            $(".viewProfile").on('click', function () {
                var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
                window.location = link;
            });

            $("#index").ready(function () {
                var AlphaIndexes = [];
                var alphaCounter = 0; // counter for letters present in indexer
                for (var index = 0; index < self.members().length; index++) {
                    //    console.log("here : " + index);
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
                    }
                })
            });



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
                    }
                })
            });

            self.handleOpen = $(".star").click(function () {
                $("#modalDialog1").ojDialog("open");
                self.desc('');
                self.textError('');
            });

            self.handleOKClose = $("#okButton").click(function () {
//                $("#modalDialog1").ojDialog("close");
            });

            self.handleOpen = $(".starTeam").click(function () {
                $("#modalDialog2").ojDialog("open");
                self.desc('');
                self.textError('');
                self.p(1);
                self.image1("css/images/green-button.png")
                self.image2("css/images/disable.png");
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog2").ojDialog("close");
            });
            // feedback...
            self.handleOpen = $(".feedbackBuddy").click(function () {
                $("#modalDialog8").ojDialog("open");
                self.desc('');
                self.textError('');
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog8").ojDialog("close");
            });
            // feedbackLead...
            self.handleOpen = $(".feedbackBuddyLead").click(function () {
                $("#modalDialog8").ojDialog("open");
                self.desc('');
                self.textError('');
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog8").ojDialog("close");
            });
            $(".tabIcon").click(function () {
               $(".tabIcon").removeClass('oj-tabs-title-active');
               $(this).addClass('oj-tabs-title-active');
           });

        }, 600);
    }
    return myTeamContentViewModel;
});



