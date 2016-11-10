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
    function request() {
        var req = Object();
        req.smsg = data['message'].subString(0, 20);
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

        var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);
                self.role_name(res['attributes']['data']['role_name']);
//                console.log(res['attributes']['data']['id']);
//                console.log(res['attributes']['data']['role_name']);
//
//                if (self.role_name() === 'Team Member') {
//                    $('#rateTab2').hide();
//
//                } else {
//
//                    $('#rateTab2').show();
//
//                }
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
                        self.manager_name(result['attributes']['data'][1]['manager_name']);
                        self.manager_pic(result['attributes']['data'][1]['google_picture_link']);
                        self.manager_id(result['attributes']['data'][1]['manager_id']);
                    }
                });

            }
        });



        var smsg = "a;slkdfja;l asdlkf la;sdj fl;askjd flajs dfl;j asdf";
        var lmsg = "aslkd fja;sdlkf a;sldkjf as;ldfj alsdfja sld;fja sl;dfj alsjdf la;sjd flasj dfl;jas dflja sdlfjasl df asdf jaslk;dfj laksjdf l;asjd fl;ajsdf lasdj flkasjdfioasyfias jfkjjas fkasdhf asiuodyf asf aslkd fja;sdlkf a;sldkjf as;ldfj alsdfja sld;fja sl;dfj alsjdf la;sjd flasj dfl;jas dflja sdlfjasl df asdf jaslk;dfj laksjdf l;asjd fl;ajsdf lasdj flkasjdfioasyfias jfkjjas fkasdhf asiuodyf asf aslkd fja;sdlkf a;sldkjf as;ldfj alsdfja sld;fja sl;dfj alsjdf la;sjd flasj dfl;jas dflja sdlfjasl df asdf jaslk;dfj laksjdf l;asjd fl;ajsdf lasdj flkasjdfioasyfias jfkjjas fkasdhf asiuodyf asf";
        self.requestDescription = ko.observable(smsg);
        self.lrequestDescription = ko.observable(lmsg);
        setTimeout(function () {
            $('.openDiv').click(function () {
                $(this).parent().prev('.open-more').slideToggle();
                if ($(this).parent().prev().prev().children('span').text() == smsg) {
                    $(this).children("span").children("span").children("i").addClass("zmdi-caret-up");
                    $(this).children("span").children("span").children("i").removeClass("zmdi-caret-down");
                    $(this).children("span").children("span:nth-child(2)").html("Less");
                    $(this).parent().prev().prev().addClass("hide");
                    $(this).parent().prev().prev().children('span').text(lmsg);
                } else {
                    if ($(this).parent().prev().prev().children('span').text() == lmsg) {
                        $(this).children("span").children("span:nth-child(2)").html("More");
                        $(this).children("span").children("span").children("i").removeClass("zmdi-caret-up");
                        $(this).children("span").children("span").children("i").addClass("zmdi-caret-down");
                        $(this).parent().prev().prev().removeClass("hide");
                        $(this).parent().prev().prev().children('span').text(smsg);
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
