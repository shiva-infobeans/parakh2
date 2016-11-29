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
        member.plus = data['pluscount'];
        member.minus = data['minuscount'];
        return member;
    }
    function leadTeam(data) {
        var myTeam = this;
        myTeam.myName = data['google_name'];
        myTeam.myId = data['user_id'];
        myTeam.myDesign = data['designation'];
        myTeam.myEmail = data['google_email'];
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

        //indexer for other team members
        self.indexer2Letters = ko.observableArray();
        self.makeUnderLine2 = function (data, event) {
            $("#index").children("span").each(function () {
                if ($(this).children().hasClass('indexerUnderline')) {
                    $(this).children().removeClass('indexerUnderline');
                }
            });
            $(event.target).addClass('indexerUnderline');
        }
        //indexer for my team members
        self.indexer1Letters = ko.observableArray();
        self.makeUnderLine1 = function (data, event) {
            $("#index1").children("span").each(function () {
                if ($(this).children().hasClass('indexerUnderline')) {
                    $(this).children().removeClass('indexerUnderline');
                }
            });
            $(event.target).addClass('indexerUnderline');
        }
        ///
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
                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: getUserByLead + self.lead_id(),
                        data: {user_id: res['attributes']['data']['id']},
                        success: function (task) {

                            var data = JSON.parse(task)['data'];
                            data = data.sort(function (a, b) {
                                return (a['user_name'] > b['user_name']) - (a['user_name'] < b['user_name']);
                            });
                            for (var counter1 = 0; counter1 < data.length; counter1++) {
                                self.myTeam.push(new leadTeam(data[counter1]));
                            }
                            self.data1(self.myTeam());
                            self.indexer1Letters.push("All");
                            $("#All1 a").addClass('indexerUnderline');
                            for (var c = 0; c < self.data1().length; c++) {
                                if (c == 0) {
                                    self.indexer1Letters.push(self.data1()[c]['myName'].substring(0, 1));
                                } else {
                                    var letter = self.data1()[c]['myName'].substring(0, 1);
                                    if (self.data1()[c - 1]['myName'].substring(0, 1) != letter) {
                                        self.indexer1Letters.push(letter);
                                    }

                                }
                            }
                        }
                    });
                }

                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: getOtherTeamMembers + self.userId(),
                    data: {user_id: self.userId()},
                    success: function (task) {
                        var data = JSON.parse(task)['data'];
                        data = data.sort(function (a, b) {
                            return (a['google_name'] > b['google_name']) - (a['google_name'] < b['google_name']);
                        });
                        for (var counter1 = 0; counter1 < data.length; counter1++) {
                            self.members.push(new teamMember(data[counter1]));
                        }
                        self.data2(self.members());
                        self.indexer2Letters.push("All");
                        $("#All a").addClass('indexerUnderline');
                        for (var c = 0; c < self.data2().length; c++) {
                            if (c == 0) {
                                self.indexer2Letters.push(self.data2()[c]['name'].substring(0, 1));
                            } else {
                                var letter = self.data2()[c]['name'].substring(0, 1);
                                if (self.data2()[c - 1]['name'].substring(0, 1) != letter) {
                                    self.indexer2Letters.push(letter);
                                }
                            }
                        }
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
                if (value == "All") {
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
                    var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
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
                if (value == "All") {
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
                    },
                    beforeSend: function () {
                        $("#rateMeLoader").removeClass('loaderHide');
                    },
                    complete: function () {
                        $("#rateMeLoader").addClass('loaderHide');
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
                    },
                    beforeSend: function () {
                        $("#rateMeLoader1").removeClass('loaderHide');
                    },
                    complete: function () {
                        $("#rateMeLoader1").addClass('loaderHide');
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
        self.image1 = ko.observable(src = "css/images/green-button.png");
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
                        $("#sucess").show();
                        setTimeout(function () {
                            $("#sucess").hide();
                            self.sucessMsg("");
                        }, 3000);
                    },
                    beforeSend: function () {
                        $("#rateMeLoader2").removeClass('loaderHide');
                    },
                    complete: function () {
                        $("#rateMeLoader2").addClass('loaderHide');
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

            $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
            $('#homeTab2').append(' <img src="../../images/team-inactive.png" alt="" />');

            $("#homeTab2").click(function () {
                if ($('#homeTab2 > img').attr("src") == "../../images/team-inactive.png") {
                    $('#homeTab1 > img').remove();
                    $('#homeTab2 > img').remove();
                    $('#homeTab1').append(' <img src="../../images/user.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team-active_1.png" alt="" />');
                    self.members([]);
                    self.members(self.data2());
                }
            });

            $("#home2").click(function () {
                if ($('#homeTab2 > img').attr("src") == "../../images/team-inactive.png") {
                    $('#homeTab1 > img').remove();
                    $('#homeTab2 > img').remove();
                    $('#homeTab1').append(' <img src="../../images/user.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team-active_1.png" alt="" />');
                    self.members([]);
                    self.members(self.data2());
                }
            });

            $("#homeTab1").click(function () {
                if ($('#homeTab1 > img').attr("src") == "../../images/user.png") {
                    $('#homeTab1 > img').remove();
                    $('#homeTab2 > img').remove();
                    $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team-inactive.png" alt="" />');
                    self.members([]);
                    self.members(self.data2());
                }
            });

            $("#home1").click(function () {
                if ($('#homeTab1 > img').attr("src") == "../../images/user.png") {
                    $('#homeTab1 > img').remove();
                    $('#homeTab2 > img').remove();
                    $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team-inactive.png" alt="" />');
                    self.members([]);
                    self.members(self.data2());
                }
            });


        }, 600);


    }
    return myTeamContentViewModel;
});



