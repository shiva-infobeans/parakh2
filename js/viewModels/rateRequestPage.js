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
    function rateRequestPageContentViewModel(person) {
        var self = this;
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
    }
    
    return rateRequestPageContentViewModel;
});
