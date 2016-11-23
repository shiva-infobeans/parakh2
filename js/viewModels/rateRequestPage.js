/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * rateRequestPage module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojinputtext', 'ojs/ojtabs', 'ojs/ojconveyorbelt'
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
    function request(data, userid) {
        var req = Object();
        if (data['description'].length > 100) {
            req.sComment = data['description'].substring(0, 100) + "...";
        } else {
            req.sComment = data['description'];
        }
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
        self.role = ko.observable();
        self.noPendingRequest = ko.observable("No Pending Requests.");
        self.noRejectRequest = ko.observable("No Declined Requests.");
        self.noLeadPendingRequest = ko.observable("No Pending Requests.");
        self.selectTab=ko.observable(0);

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
                        if (self.requestPendingMember().length != 0) {
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
                            }
                        }
                        if (self.requestRejectedMember().length != 0) {
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
                        success: function (res) {
                            var data1 = res['attributes']['data'];
                            for (var i = 0; i < data1.length; i++) {
                                if (data1[i]['status'] == 0) {
                                    self.requestPendingLead.push(new request(data1[i], self.userId()));
                                }
                            }
                            if (self.requestPendingLead().length != 0) {
                                self.noLeadPendingRequest("");
                            }
                        }
                    });
                }
                if (self.role_name() === 'Team Member') {
                    $('#rateTab2').hide();
                    self.selectTab(1);
                       $( "#requestHover").addClass("buddyTabRequest");
                       $('#rateTab1').append(' <img src="../../images/+1-icon-active.png" alt="" />')
                } else {
                    $('#rateTab2').show();
                    $('#hideLead').hide();
                    $( "#requestHover").addClass("hoverTabRequest2");
                           
                    $('#rateTab3').append(' <img src="../../images/request-approval-active.png" alt="" />')
                    $('#rateTab1').append(' <img src="../../images/+1-icon.png" alt="" id="Inactive1" />')
                   
                     $( "#rateTab2" ).click(function() {
                              
                    if($('#rateTab3 > img').attr("src")=="../../images/request-approval.png")
                      {
                          $('#rateTab1 > img').remove();
                          $('#rateTab3 > img').remove();
                          $('#rateTab3').append(' <img src="../../images/request-approval-active.png" alt="" />')
                          $('#rateTab1').append(' <img src="../../images/+1-icon.png" alt="" id="Inactive1" />')                  
                    }
                      });
                    $( "#rateTab3" ).click(function() {
                              
                    if($('#rateTab3 > img').attr("src")=="../../images/request-approval.png")
                      {
                          $('#rateTab1 > img').remove();
                          $('#rateTab3 > img').remove();
                          $('#rateTab3').append(' <img src="../../images/request-approval-active.png" alt="" />')
                          $('#rateTab1').append(' <img src="../../images/+1-icon.png" alt="" id="Inactive1" />') 
                    
                    }
                      });
                      
                       $( "#rateTab5" ).click(function() {
                      if($('#rateTab1 > img').attr("src")=="../../images/+1-icon.png")
                      {
                          console.log(" no aert");
                          $('#rateTab1 > img').remove();
                          $('#rateTab3 > img').remove();
                          $('#rateTab3').append(' <img src="../../images/request-approval.png" alt="" />');
                          $('#rateTab1').append(' <img src="../../images/+1-icon-active.png" alt="" id="Inactive1" />');
                      }
                    });
                      
                      $( "#rateTab1" ).click(function() {
                      if($('#rateTab1 > img').attr("src")=="../../images/+1-icon.png")
                      {
                          console.log(" no aert");
                          $('#rateTab1 > img').remove();
                          $('#rateTab3 > img').remove();
                          $('#rateTab3').append(' <img src="../../images/request-approval.png" alt="" />');
                          $('#rateTab1').append(' <img src="../../images/+1-icon-active.png" alt="" id="Inactive1" />');
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
                        if(result['attributes']['data'].length == 2){
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
        setTimeout(function () {
          
            $(".approveDisapprove").on('click', function () {
                
                var userId = $(this).attr('userId');
                var requestId = $(this).attr('requestId');
                var type = $(this).attr('type');
                var descHTML = $(this).parent().prev().children().children('#text-area20');
                var descriptionChange = (descHTML.val() != "") ?
                        descHTML.val() : $(this).attr('descComment');
                var to_id = $(this).attr('to_id');
                var removeHtml = $(this);
                $.ajax({
                    headers: {secret: secret},
                    method: 'POST',
                    url: requestDecision,
                    data: {u_id: userId, rq_id: requestId, st: type, desc: descriptionChange, to_id: to_id},
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
                        }, 3000);
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
                        var smsg = $(this).children("span").children("span:nth-child(3)").text().substring(0, 100) + "...";
                        $(this).parent().prev().prev().children('span').text(smsg);
                        $(this).parent().prev().prev().removeClass("hide");
                    }
                }

            });
            $(".openDiv").each(function () {
                //console.log();
                if ($(this).children().children("span:nth-child(3)").text().length <= 100) {
                    $(this).addClass('hide');
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
