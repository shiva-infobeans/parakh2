/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * rateRequestPage module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', , 'ojs/ojtabs', 'ojs/ojconveyorbelt'
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
    function request(data) {
        var req = Object();
        req.sComment = data['description'].substring(0, 20);
        req.lComment = data['description'];
        req.pic = data['google_picture_link'];
        req.name = data['google_name'];
        req.designation = data['designation'];
        req.date = dateformat(data['created_date']);
        return req;
    }
    function rateRequestPageContentViewModel(person) {
        var self = this;
        self.userId = ko.observable();
        self.requestRejected = ko.observableArray();
        self.requestPending = ko.observableArray();


        



        self.pic = "http://www.freeiconspng.com/uploads/blank-face-person-icon-7.png";
        self.feedbackImage = ko.observable("https://pixabay.com/static/uploads/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
        self.name = "Shiva Shirbhate";
        self.feedbackdesignation = ko.observable("designation");
        self.feedbackDescription = ko.observable("descrioption 123 asdf asdf");
        self.feedbackDate = ko.observable("date here");


        var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);

                var requestUrl = oj.Model.extend({
                    url: getRequests + self.userId()
                });
                var requestFetch = new requestUrl();
                requestFetch.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        var data1 = res['attributes']['data'];
                        for (var i = 0; i < data1.length; i++) {
                            if (data1[i]['status'] == 0) {
                                self.requestPending.push(new request(data1[i]));
                            }
                            if (data1[i]['status'] == 1) {
                                self.requestRejected.push(new request(data1[i]));
                            }
                        }
                    }
                });
            }
        });

        setTimeout(function () {
            $(".approveDisapprove").on('click', function () {
                console.log($(this).attr('type'));
                console.log($(this).attr('id1'));
                var descriptionChange = $(this).parent().prev().children().children('#text-area20').val() =="" ? 
                $(this).parent().prev().children().children('#text-area20').val() : $(this).attr('desc');
                
                
                var removeHtml = $(this);
                removeHtml.parent().parent().html("");
                    
                return false;
                $.ajax({
                            headers: {secret: secret},
                            method: 'POST',
                            url: addFeedbackResponse,
                            data: {login_user_id: id, feedback_to: feedback_to, feedback_desc: descriptionChange},
                            success: function () {
                                responseDesc.val("");  
                            }
                        });
            });
            $('.openDiv').click(function () {

                $(this).parent().prev('.open-more').slideToggle();
                if ($(this).children("span").children("span:nth-child(2)").html() == "More") {
                    $(this).children("span").children("span").children("i").addClass("zmdi-caret-up");
                    $(this).children("span").children("span").children("i").removeClass("zmdi-caret-down");
                    $(this).children("span").children("span:nth-child(2)").html("Less");
                    $(this).parent().prev().prev().addClass("hide");
                    var lmsg = $(this).children("span").children("span:nth-child(3)").text();
                    $(this).parent().prev().prev().children('span').text(lmsg);
                } else {
                    if ($(this).children("span").children("span:nth-child(2)").html() == "Less") {
                        $(this).children("span").children("span:nth-child(2)").html("More");
                        $(this).children("span").children("span").children("i").removeClass("zmdi-caret-up");
                        $(this).children("span").children("span").children("i").addClass("zmdi-caret-down");
                        $(this).parent().prev().prev().removeClass("hide");
                        var smsg = $(this).children("span").children("span:nth-child(3)").text().substring(0, 20);
                        $(this).parent().prev().prev().children('span').text(smsg);
                    }
                }

            });
        }, 500);

    }

    return rateRequestPageContentViewModel;
});
