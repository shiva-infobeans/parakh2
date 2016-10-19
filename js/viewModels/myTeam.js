/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * myTeam module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout'
            , 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojtabs'
            , 'ojs/ojconveyorbelt', 'ojs/ojcomponentcore', 'ojs/ojmodule'
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
        return member;
    }
    function dataComment(comment1, commenter1, commentDate1) {
        var com = this; // this is for object of this function
        com.comment = comment1;
        com.commenter = commenter1;
        com.commentDate = commentDate1.substring(0, commentDate1.indexOf(' '));
        return com;
    }
    function myTeamContentViewModel(person) {
        var self = this;
        
        self.members = ko.observableArray([]);
        self.data2 = ko.observable();
        self.userId = ko.observable();
        self.picture = ko.observable("");
        self.myname12 = ko.observable("");
        self.plus = ko.observable("");
        self.minus = ko.observable("1");
        
        var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getId = new user();
        getId.fetch({
            headers: {secret: secret},
            success: function (res) {
                self.userId(res['attributes']['data']['id']);
                var TaskRecord = oj.Model.extend({
                    url: getOtherTeamMembers + self.userId()
                });
                var task = new TaskRecord();
                task.fetch({
                    headers: {secret: 'parakh-revamp-local-key-2016'},
                    success: function (res) {
                        var data = task.attributes['data'];
                        for (var counter1 = 0; counter1 < data.length; counter1++) {
                            self.members.push(new teamMember(data[counter1]));
                        }
                        self.data2(self.members());
                        data = data.sort(function (a, b) {
//                    console.log(a['google_name'] +" "+ b['google_name']);
                            return (a['google_name'] > b['google_name']) - (a['google_name'] < b['google_name']);
                        });
                    }
                });
            }
        });
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

        self.arrangeIndex = function (data, event) {
            if (event.target.tagName == 'A') {
                var value = event.target.href;
                value = value.substr(value.lastIndexOf('/') + 1);
                var temp_data = [];
                self.members([]);
                if (value == "ALL") {
                    self.members([]);
                    self.members(self.data2());
                    if (0 != self.members().length)
                        self.noMembers("");
                } else {
                    var temp_data = [];
                    self.members([]);
                    for (var counter = 0; counter < self.data2().length; counter++) {
                        if (self.data2()[counter]['name'].charAt(0) == value) {
                            self.members.push(self.data2()[counter]);
                        }
                    }

                }
                // modal for view profile
                setTimeout(function () {
                    
                    $("#close").on("click", function () {
                        $("#open-modal12").fadeOut();
                        $("#open-modal12").removeClass('open');
                    });
                }, 500);
///end of the modal.

            }

        };
        $("body").on('click', '.rateBuddy', function () {
            //console.log($(this));
            console.log($(this).attr("id"));
            console.log(self.userId());

        });


// modal for view profile
//variables
        setTimeout(function () {
           
            $("#close").on("click", function () {
                $("#open-modal12").fadeOut();
                $("#open-modal12").removeClass('open');
            });
        }, 500);

    }
    return myTeamContentViewModel;
});
