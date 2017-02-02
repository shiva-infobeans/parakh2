/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * myTeam module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', , 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'accordin/helpTextMsg'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function teamMember(data) {
        var member = this;
        member.name = data['google_name'];
        member.userId = data['id'];
        member.pic = data['google_picture_link'] == "" ? '/images/default.png' : data['google_picture_link'];
        if(member.pic == '/images/default.png')
        {
            member.intials = nameFunction(data['google_name']);
        }else
        {
            member.intials = '';
        }
        member.designation = data['designation'];
        member.role_name = data['role_name'];
        member.google_id = data['google_id'];
        member.plus = data['pluscount'] != null ? data['pluscount'] : 0;
        member.minus = data['minuscount'] != null ? data['minuscount'] : 0;
        return member;
    }
    function leadTeam(data) {
        var myTeam = this;
        myTeam.myName = data['google_name'];
        if(data['picture'] == '/images/default.png')
        {
            myTeam.intials = nameFunction(data['google_name']);
        }else
        {
            myTeam.intials = '';
        }
        myTeam.myId = data['user_id'];
        myTeam.myDesign = data['designation'];
        myTeam.myEmail = data['google_email'];
        myTeam.myPic = data['picture'] == "" ? 'images/warning-icon-24.png' : data['picture'];
        myTeam.plus = data['pluscount'] != null ? data['pluscount'] == 0 ? 0 : "+" + data['pluscount'] : 0;
        myTeam.minus = data['minuscount'] != null ? data['minuscount'] == 0 ? 0 : "-" + data['minuscount'] : 0;
        return myTeam;
    }
    function nameFunction(NAME) {
        var initial = NAME.charAt(0) + NAME.charAt(NAME.lastIndexOf(" ") + 1);
        return initial;
    }
    function myTeamContentViewModel(person) {
        var self = this;
        self.image = ko.observable();
        self.intials_feedback = ko.observable("");
        self.intials_rate = ko.observable("");
        self.intials_icc = ko.observable("");
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
        self.intials = ko.observable("");
        self.for_id = ko.observable();
        self.role_name = ko.observable();
        self.desc = ko.observable();
        self.textError = ko.observable();
        self.sucessMsg = ko.observable();
        self.selectTab = ko.observable(0);
        self.sucessMsgFeedback = ko.observable();
        self.showHelpComment = ko.observable(feedbackBuddyPage);

        self.myTeamTab = ko.observable(2);
        ///////////// tab switching ///////////
        self.myTeamTab1 = function () {
            self.myTeamTab(1);
        }
        self.myTeamTab2 = function () {
            self.myTeamTab(2);
        }

        // code for lazy loading for all members here.
        self.lazyAllMembers = ko.observableArray();
        self.rowcountAllMember = ko.observable(0);
        self.pageNumAllMembers = ko.observable(0);
        self.lazyAllBlock = ko.observable(6);
        self.lazyAllInitBlock = ko.observable(9);

        // code for lazy loading for My team members here.
        self.lazyMyMembers = ko.observableArray();
        self.rowcountMyMember = ko.observable(0);
        self.pageNumMyMembers = ko.observable(0);
        self.lazyMyBlock = ko.observable(6);
        self.lazyMyInitBlock = ko.observable(9);


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

                    $('#tabs ul li:first-child').hide();

                } else {

                    $('#tabs ul li:first-child').addClass('abc').show();
                    //lead id user
                    $.ajax({
                        headers: {secret: secret},
                        method: 'POST',
                        url: getUserByLead + self.lead_id(),
                        data: {user_id: res['attributes']['data']['id']},
                        success: function (task) {
                            self.myTeamTab(1);
                            var data = JSON.parse(task)['data'];
                            data = data.sort(function (a, b) {
                                return (a['user_name'] > b['user_name']) - (a['user_name'] < b['user_name']);
                            });
                            for (var counter1 = 0; counter1 < data.length; counter1++) {
                                self.lazyMyMembers.push(new leadTeam(data[counter1]));
                                //self.myTeam.push(new leadTeam(data[counter1]));
                            }
                            if (data.length != 0) {
                                self.rowcountMyMember(data.length);

                                if (data.length < self.lazyMyInitBlock())
                                {
                                    var loadData = data.length;
                                    $("#myTeamLazy").hide();
                                } else {
                                    var loadData = self.lazyMyInitBlock();
                                }

                                for (var c = 0; c < loadData; c++) {
                                    self.myTeam.push(self.lazyMyMembers()[c]);
                                    self.pageNumMyMembers(self.pageNumMyMembers() + 1);
                                }
                            }else{
                                $("#myTeamLazy").hide();
                            }
                            self.data1(self.lazyMyMembers());
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
                            self.lazyAllMembers.push(new teamMember(data[counter1]));
                        }
                        if (data.length != 0) {
                            self.rowcountAllMember(data.length);
                            self.rowcountAllMember();

                            if (data.length < self.lazyAllInitBlock())
                            {
                                var loadData = data.length;
                                $("#otherTeamLazy").hide();
                            } else {
                                var loadData = self.lazyAllInitBlock();
                            }

                            for (var c = 0; c < loadData; c++) {
                                self.members.push(self.lazyAllMembers()[c]);
                                self.pageNumAllMembers(self.pageNumAllMembers() + 1);
                            }
                        }else{
                            $("#otherTeamLazy").hide();
                        }
                        self.data2(self.lazyAllMembers());
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
                $("#otherTeamLazy").hide();
                self.pageNumAllMembers(self.rowcountAllMember());
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
                $(".viewProfile1").on('click', function () {
                    var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
                    window.location = link;
                });

            }
            // feedback...
            self.handleOpen = $(".feedbackBuddy").click(function () {
                $("#modalDialog8").ojDialog("open");
                self.showHelpComment(feedbackBuddyPage);
                self.desc('');
                self.textError('');
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog8").ojDialog("close");
                self.desc('');
                self.textError('');
            });
            // feedbackLead...
            self.handleOpen = $(".feedbackBuddyLead").click(function () {
                $("#modalDialog8").ojDialog("open");
                self.desc('');
                self.showHelpComment(feedbackBuddyPage);
                self.textError('');
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog8").ojDialog("close");
                self.desc('');
                self.textError('');
            });

            //rateBuddy...
            self.handleOpen = $(".star").click(function () {
                self.showHelpComment(rateBuddyPage);
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
                $("#myTeamLazy").hide();
                self.pageNumMyMembers(self.rowcountMyMember());
                var value = event.target.href;
                value = value.substr(value.lastIndexOf('/') + 1);
                var temp_data = [];
                self.myTeam([]);
                if (value == "All") {
                    self.myTeam([]);
                    self.myTeam(self.data1());
                } else {
                    var temp_data = [];
                    self.myTeam([]);
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
                    self.showHelpComment(feedbackBuddyPage);
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

            self.handleOpen = $(".starTeam").click(function () {
                $("#modalDialog2").ojDialog("open");
                self.desc('');
                self.textError('');
                self.p(1);
                self.image1("../../images/active(+1).png")
                self.image2("../../images/disable(-1).png");
                self.showHelpComment(rateBuddyPage);
            });

            self.handleOKClose = $("#okButton").click(function () {
                $("#modalDialog2").ojDialog("close");
            });
        };

        $("body").on('click', '.viewProfile1', function () {
            var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
            window.location = link;
        });

        $("body").on('click', '.viewProfile', function () {
            var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
            window.location = link;
        });
        //rateBuddy
        $("body").on('click', '.rateBuddy', function () {
            $("#modalDialog1").ojDialog("open");
            self.desc('');
            self.textError('');
            self.for_id($(this).attr("id"));
            self.image($(this).attr("image"));
            self.myname($(this).attr("myname"));
            self.showHelpComment(rateBuddyPage);
            if ($(this).attr("image") == '/images/default.png')
            {
                self.intials_icc(nameFunction($(this).attr("myname")));
            } else
            {
                self.intials_icc("");
            }
            self.myDesignation($(this).attr("myDesignation"));
            self.intials($(this).attr("intials"))
            $('.textArea2').val('');
        });
        //feedbackLead
        $("body").on('click', '.feedbackBuddyLead', function () {
            $("#modalDialog8").ojDialog("open");
            self.desc('');
            self.textError('');
            self.for_id($(this).attr("myTeamId"));
            self.image($(this).attr("teamImage"));
            self.myname($(this).attr("teamName"));
            self.showHelpComment(feedbackBuddyPage);
            if ($(this).attr("teamImage") == '/images/default.png')
            {
                self.intials_feedback(nameFunction($(this).attr("teamName")));
            } else
            {
                self.intials_feedback('');
            }
            self.myDesignation($(this).attr("teamDesig"));
            $('.textArea-feedback').val('');
        });
        //feedback...
        $("body").on('click', '.feedbackBuddy', function () {
            self.for_id($(this).attr("id"));
            self.image($(this).attr("image"));
            self.myname($(this).attr("myname"));
            self.showHelpComment(feedbackBuddyPage);
            if ($(this).attr("image") == '/images/default.png')
            {
                self.intials_feedback(nameFunction($(this).attr("myname")));
            } else
            {
                self.intials_feedback('');
            }
            self.myDesignation($(this).attr("myDesignation"));
        });
        //submit for rate buddy
        self.submitModal = function () {
            self.desc(self.desc().trim());
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please provide a reason for your rating.");
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

                        /*refersh other team member div*/
                        self.lazyAllMembers([]);
                        self.members([]);
                        self.pageNumAllMembers(0);
                        self.indexer2Letters([]);
                        self.lazyAllInitBlock(9);
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
                                    self.lazyAllMembers.push(new teamMember(data[counter1]));
                                }
                                if (data.length != 0) {
                                    self.rowcountAllMember(data.length);
                                    self.rowcountAllMember();

                                    if (data.length < self.lazyAllInitBlock())
                                    {
                                        var loadData = data.length;
                                        $("#otherTeamLazy").hide();
                                    } else {
                                        var loadData = self.lazyAllInitBlock();
                                    }

                                    for (var c = 0; c < loadData; c++) {
                                        self.members.push(self.lazyAllMembers()[c]);
                                        self.pageNumAllMembers(self.pageNumAllMembers() + 1);
                                    }
                                }else{
                                    $("#otherTeamLazy").hide();
                                }
                                self.data2(self.lazyAllMembers());
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
                        /*end refresh other team member div*/
                        setTimeout(function () {
                            $("#sucess").hide();
                            self.sucessMsg("");
                        }, 10000);
                        self.desc('');
                        self.textError('');
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
            self.desc(self.desc().trim());
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please provide comments for your feedback.");
                return false;
            } else {
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: addFeedback,
                    data: {feedback_from: self.userId(), feedback_to: self.for_id(), feedback_description: self.desc()},
                    success: function () {
                        $("#modalDialog8").ojDialog("close");
                        $("#sucessFeedback").show();
                        self.sucessMsgFeedback("Feedback sent successfully!");
                        setTimeout(function () {
                            $("#sucessFeedback").hide();
                            self.sucessMsgFeedback("");
                        }, 10000);
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
            self.showHelpComment(rateBuddyPage);
            self.desc('');
            self.textError('');
            self.p(1);
            self.image1("../../images/active(+1).png")
            self.image2("../../images/disable(-1).png");
            self.teamImage($(this).attr("teamImage"));
            if ($(this).attr("teamImage") == '/images/default.png')
            {
                self.intials_rate(nameFunction($(this).attr("teamName")));
            } else
            {
                self.intials_rate('');
            }
            self.myId($(this).attr("myTeamId"));
            self.teamName($(this).attr("teamName"));
            self.teamDesig($(this).attr("teamDesig"));
            self.intials($(this).attr("intials"));
            $("#modalDialog2").ojDialog("open");

        });

        //feedback...
        $("body").on('click', '.feedbackBuddy', function () {
            self.teamImage($(this).attr("teamImage"));
            self.showHelpComment(feedbackBuddyPage);
            if ($(this).attr("teamImage") == '/images/default.png')
            {
                self.intials_rate(nameFunction($(this).attr("teamName")));
            } else
            {
                self.intials_rate('');
            }
            self.myId($(this).attr("myTeamId"));
            self.teamName($(this).attr("teamName"));
            self.teamDesig($(this).attr("teamDesig"));

        });
        //feedbackLead
        $("body").on('click', '.feedbackBuddyLead', function () {
            $("#modalDialog8").ojDialog("open");
            self.desc('');
            self.textError('');
            self.showHelpComment(feedbackBuddyPage);
            self.teamImage($(this).attr("teamImage"));
            if ($(this).attr("teamImage") == '/images/default.png')
            {
                self.intials_rate(nameFunction($(this).attr("teamName")));
            } else
            {
                self.intials_rate('');
            }

            self.myId($(this).attr("myTeamId"));
            self.teamName($(this).attr("teamName"));
            self.teamDesig($(this).attr("teamDesig"));
            self.intials($(this).attr("intials"));
        });
        self.p = ko.observable(1);

        // +1 rating on green button 
        self.image1 = ko.observable(src = "../../images/active(+1).png");
        self.image2 = ko.observable(src = "../../images/disable(-1).png");
        this.plusOne = function () {
            self.p(1);
            self.image1("../../images/active(+1).png")
            self.image2("../../images/disable(-1).png");
        };
        //-1 ratig on red button image

        this.minusOne = function () {
            self.p(0);
            self.image1("../../images/disable(+1).png")
            self.image2("../../images/active(-1).png");

        };
        // default +1 on submit button 
        this.leadSubmit = function () {
            self.desc(self.desc().trim());
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please provide a reason for your rating.");
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
                        /*refersh users list by lead after give +1 rating*/
                        var user = oj.Model.extend({
                            url: getUserByEmail + person['email']
                        });
                        var getId = new user();
                        getId.fetch({
                            headers: {secret: secret},
                            success: function (res) {
                                // self.userId(res['attributes']['data']['id']);
                                // self.lead_id(res['attributes']['data']['id']);
                                // self.role_name(res['attributes']['data']['role_name']);

                            self.lazyMyMembers([]);
                            self.myTeam([]);
                            self.pageNumMyMembers();
                            self.indexer1Letters([]);
                            self.lazyMyInitBlock(9);
                            $.ajax({
                                headers: {secret: secret},
                                method: 'POST',
                                url: getUserByLead + self.lead_id(),
                                data: {user_id: res['attributes']['data']['id']},
                                success: function (task) {
                                    self.myTeamTab(1);
                                    var data = JSON.parse(task)['data'];
                                    data = data.sort(function (a, b) {
                                        return (a['user_name'] > b['user_name']) - (a['user_name'] < b['user_name']);
                                    });
                                    for (var counter1 = 0; counter1 < data.length; counter1++) {
                                        self.lazyMyMembers.push(new leadTeam(data[counter1]));
                                        //self.myTeam.push(new leadTeam(data[counter1]));
                                    }
                                    if (data.length != 0) {
                                        self.rowcountMyMember(data.length);

                                        if (data.length < self.lazyMyInitBlock())
                                        {
                                            var loadData = data.length;
                                            $("#myTeamLazy").hide();
                                        } else {
                                            var loadData = self.lazyMyInitBlock();
                                        }

                                        for (var c = 0; c < loadData; c++) {
                                            self.myTeam.push(self.lazyMyMembers()[c]);
                                            self.pageNumMyMembers(self.pageNumMyMembers() + 1);
                                        }
                                    }else{
                                        $("#myTeamLazy").hide();
                                    }
                                    self.data1(self.lazyMyMembers());
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
                    });
                    /*end refresh*/
                        setTimeout(function () {
                            $("#sucess").hide();
                            self.sucessMsg("");
                        }, 10000);
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
            $("body").on('click', '.viewProfile1', function () {
                var link = "memberProfile.html?id=" + $(this).attr("myTeamId");
                window.location = link;
            });


            if (self.role_name() === 'Team Member') {
                self.selectTab(1);
                $("#membersHover").addClass("buddyTabRequest1");

                $('#homeTab1').append(' <img src="../../images/team-new-active.png" alt="" />')
            } else {
                $("#membersHover").addClass("hoverTab2");
                $('#homeTab1').append(' <img src="../../images/team-new.png" alt="" />');
                $('#homeTab2').append(' <img src="../../images/team-active_1.png" alt="" />');

                $("#homeTab2").click(function () {
                    if ($('#homeTab2 > img').attr("src") == "../../images/team-active_1.png") {
                        $('#homeTab1 > img').remove();
                        $('#homeTab2 > img').remove();
                        $('#homeTab1').append(' <img src="../../images/team-new-active.png" alt="" />');
                        $('#homeTab2').append(' <img src="../../images/team-inactive.png" alt="" />');
//                        self.members([]);
//                        self.members(self.data2());
                    }
                });

                $("#home2").click(function () {
                    if ($('#homeTab2 > img').attr("src") == "../../images/team-active_1.png") {
                        $('#homeTab1 > img').remove();
                        $('#homeTab2 > img').remove();
                        $('#homeTab1').append(' <img src="../../images/team-new-active.png" alt="" />');
                        $('#homeTab2').append(' <img src="../../images/team-inactive.png" alt="" />');
//                        self.members([]);
//                        self.members(self.data2());
                    }
                });

                $("#homeTab1").click(function () {
                    if ($('#homeTab1 > img').attr("src") == "../../images/team-new-active.png") {
                        $('#homeTab1 > img').remove();
                        $('#homeTab2 > img').remove();
                        $('#homeTab1').append(' <img src="../../images/team-new.png" alt="" />');
                        $('#homeTab2').append(' <img src="../../images/team-active_1.png" alt="" />');
//                        self.members([]);
//                        self.members(self.data2());
                    }
                });

                $("#home1").click(function () {
                    if ($('#homeTab1 > img').attr("src") == "../../images/team-new-active.png") {
                        $('#homeTab1 > img').remove();
                        $('#homeTab2 > img').remove();
                        $('#homeTab1').append(' <img src="../../images/team-new.png" alt="" />');
                        $('#homeTab2').append(' <img src="../../images/team-active_1.png" alt="" />');
//                        self.members([]);
//                        self.members(self.data2());
                    }
                });

            }
        }, 600);

        self.handleOpen = $(".star").click(function () {
            $("#modalDialog1").ojDialog("open");
            self.desc('');
            self.textError('');
            self.showHelpComment(rateBuddyPage);
        });

        self.handleOpen = $(".starTeam").click(function () {
            self.showHelpComment(rateBuddyPage);
            $("#modalDialog2").ojDialog("open");
            self.desc('');
            self.textError('');
            self.p(1);
            self.image1("../../images/active(+1).png")
            self.image2("../../images/disable(-1).png");

        });

        // feedback...
        self.handleOpen = $(".feedbackBuddy").click(function () {
            $("#modalDialog8").ojDialog("open");
            self.desc('');
            self.textError('');
            self.showHelpComment(feedbackBuddyPage);

        });

        // feedbackLead...
        self.handleOpen = $(".feedbackBuddyLead").click(function () {
            $("#modalDialog8").ojDialog("open");
            self.desc('');
            self.showHelpComment(feedbackBuddyPage);
            self.textError('');

        });

        $(window).scroll(function () {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (self.myTeamTab() == 2) {
                    if (self.pageNumAllMembers() < self.rowcountAllMember()) {
                        var count = self.pageNumAllMembers();
                        if (self.pageNumAllMembers() + self.lazyAllBlock() >= self.rowcountAllMember()) {
                            var loadRecordCount = self.rowcountAllMember() - self.pageNumAllMembers();
                            $("#otherTeamLazy").hide();
                        } else {
                            var loadRecordCount = self.lazyAllBlock();
                        }
                        for (var c = count; c < count + loadRecordCount; c++) {
                            try {
                                self.members.push(self.data2()[c]);
                                self.pageNumAllMembers(self.pageNumAllMembers() + 1);
                            } catch (e) {

                            }
                        }
                    }else{
                        $("#otherTeamLazy").hide();
                    }
                }
                if (self.myTeamTab() == 1) {
                    if (self.pageNumMyMembers() < self.rowcountMyMember()) {
                        var count = self.pageNumMyMembers();
                        if (self.pageNumMyMembers() + self.lazyMyBlock() >= self.rowcountMyMember()) {
                            var loadRecordCount = self.rowcountMyMember() - self.pageNumMyMembers();
                        } else {
                            var loadRecordCount = self.lazyMyBlock();
                            $("#myTeamLazy").hide();
                        }
                        for (var c = count; c < count + loadRecordCount; c++) {
                            try {
                                self.myTeam.push(self.lazyMyMembers()[c]);
                                self.pageNumMyMembers(self.pageNumMyMembers() + 1);
                            } catch (e) {

                            }
                        }
                    }else{
                        $("#myTeamLazy").hide();
                    }
                }
            }
        });
        //help comment 
        oj.Components.setDefaultOptions({
            'editableValue':
                    {
                        'displayOptions':
                                {
                                    'messages': ['notewindow']
                                }
                    }
        });
        self.textAreaChange = function (context, value) {
            if (value['option'] == 'rawValue') {
                if (value['value'] != '') {
//                    self.showHelpComment("");
                }
            }
        }
    }
    return myTeamContentViewModel;
});



