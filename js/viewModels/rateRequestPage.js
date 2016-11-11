/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * rateRequestPage module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojinputtext', 'ojs/ojtabs', 'ojs/ojconveyorbelt'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function dateformat(date) {
        var yy = date.substring(0, date.indexOf("-"));
        date = date.substring(date.indexOf("-") + 1, date.length);
        var mm = date.substring(0, date.indexOf("-"));
        date = date.substring(date.indexOf("-") + 1, date.length);
        var dd = date.substring(0, 2);
        date = dd + "-" + mm + "-" + yy;
        return date;
    }
    function request(data, userid) {
        var req = Object();
        req.sComment = data['description'].substring(0, 20);
        req.lComment = data['description'];
        req.request_id = data['request_id'];
        req.pic = data['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data['google_picture_link'];
        req.name = data['google_name'];
        req.designation = data['designation'];
        req.from_id = data['from_id'];
        req.date = dateformat(data['created_date']);
        req.userID = userid;
        return req;
    }



    function rateRequestPageContentViewModel(person) {
        var self = this;
        self.userId = ko.observable();
        self.lead_id = ko.observable();
        self.role_name = ko.observable();
        self.lead_name = ko.observable();
        self.lead_pic = ko.observable();
        self.lead_id = ko.observable();
        self.manager_name = ko.observable();
        self.manager_pic = ko.observable();
        self.manager_id = ko.observable();
        self.desc = ko.observable();
        self.desc1 = ko.observable();
        self.textError = ko.observable();
        self.textError1 = ko.observable();
        this.sucessMsg = ko.observable("S");
        this.sucessMsg("");

        self.requestRejectedMember = ko.observableArray();
        self.requestPendingMember = ko.observableArray();
        self.requestPendingLead = ko.observableArray();
        self.requestRejectedLead = ko.observableArray();
        self.role = ko.observable();


//        self.pic = "http://www.freeiconspng.com/uploads/blank-face-person-icon-7.png";
        var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);
                self.role_name(res['attributes']['data']['role_name']);
                self.role(res['attributes']['data']['role_name']);

                var requestUrl = oj.Model.extend({
                    url: getUserPendingRequest + self.userId() + "/0" // get all the pending requests send by user to lead/manager
                });
                var requestFetch = new requestUrl();
                requestFetch.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        var data1 = res['attributes']['data'];
                        for (var i = 0; i < data1.length; i++) {
                            if (data1[i]['status'] == 0) {
                                self.requestPendingMember.push(new request(data1[i], self.userId()));
                            }
                        }
                    }
                });
                var requestUrl = oj.Model.extend({
                    url: getUserPendingRequest + self.userId() + "/1" // get all the pending requests send by user to lead/manager
                });
                var requestFetch = new requestUrl();
                requestFetch.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        var data1 = res['attributes']['data'];
                        for (var i = 0; i < data1.length; i++) {
                            if (data1[i]['status'] == 1) {
                                self.requestRejectedMember.push(new request(data1[i], self.userId()));
                            }
                        }
                    }
                });
                // for lead or manager
                if (self.role() != "Team Member") {
                    var requestUrl1 = oj.Model.extend({
                        url: getTeamMembersRequest + self.userId() // get all pending requests for the lead to approve or reject.
                    });
                    var requestFetch1 = new requestUrl1();
                    requestFetch1.fetch({
                        headers: {secret: secret},
                        success: function (res) {
                            var data1 = res['attributes']['data'];
                            for (var i = 0; i < data1.length; i++) {
                                if (data1[i]['status'] == 0) {
                                    self.requestPendingLead.push(new request(data1[i], self.userId()));
                                }
                            }
                        }
                    });
                }
                if (self.role_name() === 'Team Member') {
                    $('#rateTab2').hide();

                } else {
                    $('#rateTab2').show();
                    $('#hideLead').hide();
                }
                var lead = oj.Model.extend({
                    url: getAllLeads + self.userId(),
                });
                var getnewLead = new lead();
                getnewLead.fetch({
                    headers: {secret: secret},
                    success: function (result) {
                        var data = result['attributes']['data'];
                        self.lead_name(result['attributes']['data'][0]['manager_name']);

                        self.lead_pic(result['attributes']['data'][0]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : result['attributes']['data'][0]['google_picture_link']);
                        self.lead_id(result['attributes']['data'][0]['manager_id']);
                        self.manager_name(result['attributes']['data'][1]['manager_name']);
                        self.manager_pic(result['attributes']['data'][1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : result['attributes']['data'][1]['google_picture_link']);
                        self.manager_id(result['attributes']['data'][1]['manager_id']);
                    }
                });
            }
        });

        setTimeout(function () {

            $(".approveDisapprove").on('click', function () {

                var userId = $(this).attr('userId');
                var requestId = $(this).attr('requestId');
                var type = $(this).attr('type');
                var descriptionChange = $(this).parent().prev().children().children('#text-area20').val() == "" ?
                        $(this).parent().prev().children().children('#text-area20').val() : $(this).attr('desc');
                var to_id = $(this).attr('to_id');
//                console.log(requestId);
//                console.log(type);
//                console.log(descriptionChange);
//                console.log(to_id);
//                console.log(userId);

                var removeHtml = $(this);
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: requestDecision,
                    data: {u_id: userId, rq_id: requestId, st: type, desc: descriptionChange, to_id: to_id},
                    success: function () {
                        removeHtml.parent().parent().parent().remove();
                    }
                });
            });
            $('.openDiv').click(function () {
                //console.log($(this).children("span").children("span:nth-child(2)").html());
                if ($(this).children("span").children("span:nth-child(2)").html() == "More") {
                    $(this).parent().prev().prev().addClass("hide");
                    $(this).children("span").children("span:nth-child(2)").html("Less");
                    $(this).children("span").children("span").children("i").removeClass("zmdi-caret-down");
                    $(this).children("span").children("span").children("i").addClass("zmdi-caret-up");
                    var lmsg = $(this).children("span").children("span:nth-child(3)").text();
                    $(this).parent().prev().prev().children('span').text(lmsg);
                    $(this).parent().prev('.open-more').slideToggle();
                } else {
                    if ($(this).children("span").children("span:nth-child(2)").html() == "Less") {
                        $(this).parent().prev('.open-more').slideToggle();
                        $(this).children("span").children("span:nth-child(2)").html("More");
                        $(this).children("span").children("span").children("i").removeClass("zmdi-caret-up");
                        $(this).children("span").children("span").children("i").addClass("zmdi-caret-down");
                        var smsg = $(this).children("span").children("span:nth-child(3)").text().substring(0, 20);
                        $(this).parent().prev().prev().children('span').text(smsg);
                        $(this).parent().prev().prev().removeClass("hide");
                    }
                }

            });
        }, 500);
        //send request for +1 ratings ajax call
        self.requestManager = function () {
            if (self.desc() == '' || self.desc() == null) {
                self.textError("Please provide a reason for your request.");
                return false;
            }
            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: requestForOne,
                data: {u_id: self.userId(), l_id: self.manager_id(), desc: self.desc()},
                success: function () {
                    self.desc('');
                    self.textError('');
                    $("#sucessRate").show();
                    self.sucessMsg("Your Request is sent.");
                    setTimeout(function () {
                        $("#sucessRate").hide();
                        self.sucessMsg("");
                    }, 3000);
                }
            });
        }
        self.requestLead = function () {
            if (self.desc1() == '' || self.desc1() == null) {
                self.textError1("Please provide a reason for your request.");
                return false;
            }
            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: requestForOne,
                data: {u_id: self.userId(), l_id: self.lead_id(), desc: self.desc1()},
                success: function () {
                    self.desc1('');
                    self.textError1('');
                    $("#sucessRate").show();
                    self.sucessMsg("Your Request is sent.");
                    setTimeout(function () {
                        $("#sucessRate").hide();
                        self.sucessMsg("");
                    }, 3000);
                }
            });
        }


    }

    return rateRequestPageContentViewModel;
});
