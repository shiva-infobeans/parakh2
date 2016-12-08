/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * rateRequestPage module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojinputtext', 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'ojs/ojdialog'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function dateformat(commentDate1) {
        commentDate1 = new Date(commentDate1);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var dateReturn = commentDate1.getDate() + ' ' + monthNames[commentDate1.getMonth()] + ' ' + commentDate1.getFullYear();
        return dateReturn;
    }
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    function request(data, userid) {
        var req = Object();

        if (typeof data['comment_text'] == 'undefined') {
            req.lComment = data['description'];
            req.oldComment = data['description'];
        } else {
            if (data['comment_text'] != null) {
                if (data['comment_text'].length > 80) {
                    req.sComment = decodeHtml(data['comment_text'].substring(0, 80));
                    req.LongComment = decodeHtml(data['comment_text'].substring(80, data['comment_text'].length));
                    req.viewMore = true;
                } else {
                    req.sComment = decodeHtml(data['comment_text']);
                    req.viewMore = false;
                }
                req.lComment = decodeHtml(data['comment_text']);
            } else {
                if (data['description'].length > 80) {
                    req.sComment = decodeHtml(data['description'].substring(0, 80));
                    req.LongComment = decodeHtml(data['description'].substring(80, data['description'].length));
                    req.viewMore = true;
                } else {
                    req.sComment = decodeHtml(data['description']);
                    req.viewMore = false;
                }
                req.lComment = decodeHtml(data['description']);
            }
        }
        req.request_id = data['request_id'];
        req.pic = data['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data['google_picture_link'];
        req.name = data['google_name'];
        req.designation = data['designation'];
        req.from_id = data['from_id'];
        req.date = dateformat(data['created_date']);
        req.userID = userid;
        req.uniqueId = "pending" + data['request_id'];
        req.acceptBtnId = "accept" + data['request_id'];
        req.declineBtnId = "decline" + data['request_id'];
        req.openMoreLink = "open" + data['request_id'];
        req.lessMoreLink = "close" + data['request_id'];
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
        self.lead_role = ko.observable();
        self.manager_name = ko.observable();
        self.manager_pic = ko.observable();
        self.manager_id = ko.observable();
        self.manager_role = ko.observable();
        self.desc = ko.observable();
        self.desc1 = ko.observable();
        self.textError = ko.observable();
        self.textError1 = ko.observable();
        this.sucessMsg = ko.observable("");
        this.sucessMsg("");
        self.requestRejectedMember = ko.observableArray();
        self.requestPendingMember = ko.observableArray();
        self.requestPendingLead = ko.observableArray();
        self.requestRejectedLead = ko.observableArray();
        self.requestDeclinedLead = ko.observableArray();
        self.role = ko.observable();
        self.noPendingRequest = ko.observable("No Pending Requests.");
        self.noRejectRequest = ko.observable("No Declined Requests.");
        self.noLeadPendingRequest = ko.observable("No Pending Requests.");
        self.noLeadDeclinedRequest = ko.observable();
        self.selectTab = ko.observable(0);

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
                                $("#request").show();
                            }
                        }
                        if (self.requestPendingMember().length != 0) {
                            $("#request").hide();
                            self.noPendingRequest("");

                        }
                    }
                });
                var requestUrl = oj.Model.extend({
                    url: getUserPendingRequest + self.userId() + "/1" // get all the declined requests send by user to lead/manager
                });
                var requestFetch = new requestUrl();
                requestFetch.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        var data1 = res['attributes']['data'];
                        for (var i = 0; i < data1.length; i++) {
                            if (data1[i]['status'] == 1) {
                                self.requestRejectedMember.push(new request(data1[i], self.userId()));
                                $("#request1").show();
                            }
                        }
                        if (self.requestRejectedMember().length != 0) {
                            $("#request1").hide();
                            self.noRejectRequest("");
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
                        error: function (ee)
                        {

                        },
                        success: function (res) {

                            var data1 = res['attributes']['data'];

                            for (var i = 0; i < data1.length; i++) {
                                if (data1[i]['status'] == 0) {
                                    self.requestPendingLead.push(new request(data1[i], self.userId()));
                                    $("#request2").show();
                                }
                            }
                            if (self.requestPendingLead().length != 0) {
                                $("#request2").hide();
                                self.noLeadPendingRequest("");
                            }
                        }
                    });
                }

                // get all requests that has been declined by lead or manager.
                if (self.role() != "Team Member") {
                    $.ajax({
                        headers: {secret: secret},
                        url: getAllRejectedRequestsByLoginId,
                        method: 'POST',
                        data: {lead_id: self.userId()},
                        success: function (result) {
                            var data2 = JSON.parse(result)['data'];
                            for (var i = 0; i < data2.length; i++) {
                                self.requestDeclinedLead.push(new request(data2[i]));
                            }
                            if (data2.length === 0) {
                                self.noLeadDeclinedRequest("No Declined Request.");
                                $("#request3").show();
                            } else {
                                self.noLeadDeclinedRequest("");
                                $("#request3").hide();
                            }

                        }
                    });
                }


                if (self.role_name() === 'Team Member') {
                    $('#rateTab2').hide();
                    self.selectTab(1);
                    $("#requestHover").addClass("buddyTabRequest");
                    $('#rateTab1').append(' <img src="../../images/send-req-active.png" alt="" id="Inactive1" />')
                } else {
                    $('#rateTab2').show();
                    $('#hideLead').hide();
                    $("#requestHover").addClass("hoverTabRequest2");

                    $('#rateTab3').append(' <img src="../../images/request-approval-active.png" alt="" />')
                    $('#rateTab1').append(' <img src="../../images/send-req.png" alt="" id="Inactive1" />')
                    //$('#rateTab1').append(' <img src="../../images/+1-icon.png" alt="" id="Inactive1" />')

                    $("#rateTab2").click(function () {

                        if ($('#rateTab3 > img').attr("src") == "../../images/request-approval.png")
                        {
                            $('#rateTab1 > img').remove();
                            $('#rateTab3 > img').remove();
                            $('#rateTab3').append(' <img src="../../images/request-approval-active.png" alt="" />')
                            $('#rateTab1').append(' <img src="../../images/send-req.png" alt="" id="Inactive1" />')
                            //$('#rateTab1').append(' <img src="../../images/+1-icon.png" alt="" id="Inactive1" />')
                        }
                    });
                    $("#rateTab3").click(function () {

                        if ($('#rateTab3 > img').attr("src") == "../../images/request-approval.png")
                        {
                            $('#rateTab1 > img').remove();
                            $('#rateTab3 > img').remove();
                            $('#rateTab3').append(' <img src="../../images/request-approval-active.png" alt="" />')
                            $('#rateTab1').append(' <img src="../../images/send-req.png" alt="" id="Inactive1" />')
                            //$('#rateTab1').append(' <img src="../../images/+1-icon.png" alt="" id="Inactive1" />')

                        }
                    });

                    $("#rateTab5").click(function () {
                        if ($('#rateTab1 > img').attr("src") == "../../images/send-req.png")
                        {
                            $('#rateTab1 > img').remove();
                            $('#rateTab3 > img').remove();
                            $('#rateTab3').append(' <img src="../../images/request-approval.png" alt="" />');
                            $('#rateTab1').append(' <img src="../../images/send-req-active.png" alt="" id="Inactive1" />')
                        }
                    });

                    $("#rateTab1").click(function () {
                        if ($('#rateTab1 > img').attr("src") == "../../images/send-req.png")
                        {
                            $('#rateTab1 > img').remove();
                            $('#rateTab3 > img').remove();
                            $('#rateTab3').append(' <img src="../../images/request-approval.png" alt="" />');
                            $('#rateTab1').append(' <img src="../../images/send-req-active.png" alt="" id="Inactive1" />')
                        }
                    });


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
                        self.lead_pic(result['attributes']['data'][0]['google_picture_link']);
                        self.lead_id(result['attributes']['data'][0]['manager_id']);
                        self.lead_role(result['attributes']['data'][0]['role_name']);
                        // console.log(result['attributes']['data'][0]['role_name']);
                        if (result['attributes']['data'].length == 2) {
                            self.manager_name(result['attributes']['data'][1]['manager_name']);
                            self.manager_pic(result['attributes']['data'][1]['google_picture_link']);
                            self.manager_id(result['attributes']['data'][1]['manager_id']);
                            self.manager_role(result['attributes']['data'][1]['role_name']);
                        }
                        //console.log(result['attributes']['data'][1]['role_name']);
                    }
                });
            }
        });

        self.approveRequest = function (type, d, requestId, userId, to_id, Oldcomment) {
            $('#yesButton').attr('oldDesc',Oldcomment);
            $("#minMaxDialog").ojDialog("open");
            $('#yesButton').attr("type", type);
            $('#yesButton').attr("d", d);
            $('#yesButton').attr("requestId", requestId);
            $('#yesButton').attr("userId", userId);
            $('#yesButton').attr("to_id", to_id);
            if(type)
            {
                $('#rateme-status').html('approve');
            }else
            {
                $('#rateme-status').html('decline');
            }
        }

        self.yesProcess = function () {
            var type = $('#yesButton').attr("type");
            var d = $('#yesButton').attr("d");
            var requestId = $('#yesButton').attr("requestId");
            var userId = $('#yesButton').attr("userId");
            var to_id = $('#yesButton').attr("to_id");
            var oldComment = $('#yesButton').attr("oldDesc").trim();
            $("#minMaxDialog").ojDialog("close");
            if (type == 1)
            {
                var obj = $("#accept" + requestId);
                console.log(obj);
            } else
            {
                var obj = $("#decline" + requestId);
            }
            var descHTML = obj.parent().prev().children().children('#text-area20');
            var descriptionChange = (descHTML.val().trim() != "") ?
                    descHTML.val().trim() : oldComment;
            var removeHtml = obj;
            var datas = {u_id: userId, rq_id: requestId, st: type, desc: descriptionChange, to_id: to_id};
            //console.log(datas);
            $.ajax({
                headers: {secret: secret},
                method: 'POST',
                url: requestDecision,
                data: datas,
                success: function () {
                    removeHtml.parent().parent().parent().remove();
                    $("#sucessRate").show();
                    if (type == 0) {

                        self.sucessMsg("Rating request declined.");
                    } else {
                        self.sucessMsg("Rating request approved");
                    }
                    setTimeout(function () {
                        $("#sucessRate").hide();
                        self.sucessMsg("");
                    }, 10000);
                },
                beforeSend: function () {
                    $("#requestLoader2").removeClass('loaderHide');
                },
                complete: function () {
                    $("#requestLoader2").addClass('loaderHide');
                }
            });
        }

        self.noProcess = function (type, d, requestId, userId, to_id) {
            $("#minMaxDialog").ojDialog("close");
        }
        self.requestMore = function (e, data) {

            var obj = $("#pending" + e.request_id);
            if (obj.children("span").children("span:nth-child(2)").html() == "More") {
                obj.parent().prev().prev().addClass("hide");
                obj.children("span").children("span:nth-child(2)").html("Less");
                obj.children("span").children("span").children("i").removeClass("zmdi-caret-down");
                obj.children("span").children("span").children("i").addClass("zmdi-caret-up");
                var lmsg = obj.children("span").children("span:nth-child(3)").text();
                obj.parent().prev().prev().children('span').text(lmsg);
                obj.parent().prev('.open-more').slideToggle();
            } else {
                if (obj.children("span").children("span:nth-child(2)").html() == "Less") {
                    obj.parent().prev('.open-more').slideToggle();
                    obj.children("span").children("span:nth-child(2)").html("More");
                    obj.children("span").children("span").children("i").removeClass("zmdi-caret-up");
                    obj.children("span").children("span").children("i").addClass("zmdi-caret-down");
                    var smsg = obj.children("span").children("span:nth-child(3)").text().substring(0, 100) + "...";
                    obj.parent().prev().prev().children('span').text(smsg);
                    obj.parent().prev().prev().removeClass("hide");
                }
            }

        }

        //send request for +1 ratings ajax call
        self.requestManager = function () {
            self.desc(self.desc().trim());
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
                    }, 10000);
                },
                beforeSend: function () {
                    $("#requestLoader").removeClass('loaderHide');
                },
                complete: function () {
                    $("#requestLoader").addClass('loaderHide');
                }
            });
        }
        self.requestLead = function () {
            self.desc1(self.desc1().trim());
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
                    }, 10000);
                },
                beforeSend: function () {
                    $("#requestLoader1").removeClass('loaderHide');
                },
                complete: function () {
                    $("#requestLoader1").addClass('loaderHide');
                }
            });
        }
//        setTimeout(function(){
//            $(".openDiv").each(function () {     
//            
//            if ($(this).children().children(":last-child").text().length <= 100) {
//                $(this).addClass('hide');
//            }
//        });
//        },500);

        self.openMore = function (data, event) {
            var moreTextId = $("#" + data['openMoreLink']);
            var lessTextId = $("#" + data['lessMoreLink']);
            moreTextId.next('span').slideToggle();
            moreTextId.next().fadeIn();
            moreTextId.next().next().fadeOut();
            lessTextId.parent().removeClass('hide');
        };
        self.openLess = function (data, event) {
            var moreTextId = $("#" + data['openMoreLink']);
            var lessTextId = $("#" + data['lessMoreLink']);
            moreTextId.next('span').slideToggle();
            moreTextId.next().fadeOut();
            moreTextId.next().next().fadeIn();
            lessTextId.parent().addClass('hide');
        }
    }

    return rateRequestPageContentViewModel;
});
