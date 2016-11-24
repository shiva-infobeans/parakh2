/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtabs', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function rating(plus, minus) {
        this.plus = plus;
        this.minus = minus;
        return this;
    }

    function homeContentViewModel(person) {
        var self = this;
        self.id = ko.observable();
        self.designation = ko.observable();
        self.image0 = ko.observable();
        self.name0 = ko.observable();
        self.image1 = ko.observable();
        self.name1 = ko.observable();
        self.image2 = ko.observable();
        self.name2 = ko.observable();
        self.image3 = ko.observable();
        self.name3 = ko.observable();
        self.name0hover = ko.observable();
        self.name1hover = ko.observable();
        self.name2hover = ko.observable();
        self.name3hover = ko.observable();
        self.project0hover = ko.observable();
        self.project1hover = ko.observable();
        self.project2hover = ko.observable();
        self.project3hover = ko.observable();
        self.link0 = ko.observable();
        self.link1 = ko.observable();
        self.link2 = ko.observable();
        self.link3 = ko.observable();
        self.vieMyProfile = ko.observable();
        self.roleName = ko.observable();
        self.leadPlusWeek = ko.observable();
        self.leadPlusmonth = ko.observable();
        self.leadPlustill = ko.observable();
        self.leadMinusWeek = ko.observable();
        self.leadMinusmonth = ko.observable();
        self.leadMinustill = ko.observable();

//         get members who get +1 recently
        var rec = oj.Model.extend({
            url: getRecentRankingList
        });
        var data = new rec();
        data.fetch({
            headers: {secret: secret},
            success: function () {
//                assgning values to the varibles.
                var img0 = data.attributes['data'][0]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][0]['google_picture_link'];
                self.name0(data.attributes['data'][0]['google_name'].substr(0, data.attributes['data'][0]['google_name'].indexOf(' ')));
                self.name0hover(data.attributes['data'][0]['google_name']);
                self.project0hover(data.attributes['data'][0]['primary_project']);
                self.image0(img0);
                var person0 = "memberProfile.html?id=" + data.attributes['data'][0]['user_id'];
                self.link0(person0);

                var img1 = data.attributes['data'][1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][1]['google_picture_link'];
                self.name1(data.attributes['data'][1]['google_name'].substr(0, data.attributes['data'][1]['google_name'].indexOf(' ')));
                self.name1hover(data.attributes['data'][1]['google_name']);
                self.project1hover(data.attributes['data'][1]['primary_project']);
                self.image1(img1);
                var person1 = "memberProfile.html?id=" + data.attributes['data'][1]['user_id'];
                self.link1(person1);

                var img2 = data.attributes['data'][2]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][2]['google_picture_link'];
                self.name2(data.attributes['data'][2]['google_name'].substr(0, data.attributes['data'][2]['google_name'].indexOf(' ')));
                self.name2hover(data.attributes['data'][2]['google_name']);
                self.project2hover(data.attributes['data'][2]['primary_project']);
                self.image2(img2);
                var person2 = "memberProfile.html?id=" + data.attributes['data'][2]['user_id'];
                self.link2(person2);

                var img3 = data.attributes['data'][3]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][3]['google_picture_link'];
                self.name3(data.attributes['data'][3]['google_name'].substr(0, data.attributes['data'][3]['google_name'].indexOf(' ')));
                self.name3hover(data.attributes['data'][3]['google_name']);
                self.project3hover(data.attributes['data'][3]['primary_project']);
                self.image3(img3);
                var person3 = "memberProfile.html?id=" + data.attributes['data'][3]['user_id'];
                self.link3(person3);
            }
        });

        var profile = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var viewProfile = new profile();
        viewProfile.fetch({
            headers: {secret: secret},
            success: function (res) {
                var view = "profile.html?id=" + viewProfile.attributes['data']['id'];
                self.vieMyProfile(view);

            }
        });

        this.memberName = person['name'].substr(0, person['name'].indexOf(' '));
        this.id = ko.observable();

        this.dayPlusRatings = ko.observable(0); //for this week
        this.dayMinusRatings = ko.observable(0);

        this.monthPlusRatings = ko.observable(0); //for this month
        this.monthMinusRatings = ko.observable(0);

        this.myPlusRatings = ko.observable(0);
        this.myMinusRatings = ko.observable(0);

        self.sliderText1 = ko.observable();
        self.sliderText2 = ko.observable();
        self.sliderText3 = ko.observable();

        self.teamMembers = ko.observableArray();
        self.addteamMembers = function (obj) {
            self.teamMembers.push(obj);

            $('#filmStrip').ojFilmStrip("refresh");
        }
//pagination slider for manager start
        self.projects = ko.observableArray([]);
        self.addProject = function (obj) {
            self.projects.push(obj);
            $('#filmStrip2').ojFilmStrip("refresh");
        }
        self.pagingModel = null;
        getItemInitialDisplay1 = function (index)
        {
            return index < 1 ? '' : 'none';
        };
        getPagingModel = function ()
        {
            if (!self.pagingModel)
            {
                var filmStrip = $("#filmStrip2");
                var pagingModel = filmStrip.ojFilmStrip("getPagingModel");
                self.pagingModel = pagingModel;
            }
            return self.pagingModel;
        };// pagination slider for manager end
        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");

        getItemInitialDisplay = function (index)
        {
            return index < 4 ? '' : 'none';
        };

        var TaskRecord = oj.Model.extend({
            url: getUserByEmail + person['email'],
            //parse: parseTask
        });
        var task = new TaskRecord();
        task.fetch({
            headers: {secret: secret},
            success: function () {
                self.id(task.attributes['data']['id']);
                self.roleName(task.attributes['data']['id']);
                //lead /member service for +1 count and -1 count

                self.id(task.attributes['data']['id']);
                self.roleName(task.attributes['data']['role_name']);
                //lead /member service for +1 count and -1 count
                if (self.roleName() == "Manager") {
                    $("#slider-wrapper1").hide();
                    var leadSlide = oj.Model.extend({
                        url: getTopRankersProjectWise + self.id()
                    });


                    var leadSlideFetch = new leadSlide();
                    leadSlideFetch.fetch({
                        headers: {secret: secret},
                        success: function (result) {

                            var data = result['attributes']['data'];
                            for (var c = 0; c < data.length; c++) {
                                var obj = new Object();
                                var dat = data[0].split(",");
                                obj.name = dat[0];
                                obj.plus = dat[1] == 0 ? 0 : "+" + dat[1];
                                obj.minus = dat[2] == 0 ? 0 : "+" + dat[2];
                                self.addProject(obj);
                                if (dat[1] == 0 && dat[2] == 0)
                                {
                                    $("#srno" + c + " .slider-item").hide();
                                    $("#emptyTxt" + c).show();
                                }
                            }

                        }
                    });
                } else {
                    $("#filmStripDiv2").hide();
                    if (self.roleName() == "Lead") {
                        var leadSlide = oj.Model.extend({
                            url: getTopRankersCalendarWise + self.id()
                        });
                        var leadSlideFetch = new leadSlide();
                        leadSlideFetch.fetch({
                            headers: {secret: secret},
                            success: function (result) {
                                if (result['attributes']['data']['week']['plus'] == 0 && result['attributes']['data']['week']['minus'] == 0) {
                                    $("#hideSliderWeek").show();
                                    $("#weekSmiley").show();
                                    $("#hideSlider12").hide();
                                } else {
                                    $("#hideSliderWeek").hide();
                                    $("#weekSmiley").hide();
                                    $("#hideSlider12").show();
                                }

                                if (result['attributes']['data']['month']['plus'] == 0 && result['attributes']['data']['month']['minus'] == 0) {
                                    $("#hideMonthSlider").show();
                                    $("#monthSmiley").show();
                                    $("#hideSlider22").hide();
                                } else {
                                    $("#hideMonthSlider").hide();
                                    $("#monthSmiley").hide();
                                    $("#hideSlider22").show();
                                }
                                if (result['attributes']['data']['till_now']['plus'] == 0 && result['attributes']['data']['till_now']['minus'] == 0) {
                                    $("#inner-wrapper1").hide();
                                    $("#noRatingsScreen1").show();
                                    $("#smileyOverAll").show();
                                } else {
                                    $("#inner-wrapper1").show();
                                    $("#noRatingsScreen1").hide();
                                    $("#smileyOverAll").hide();
                                }

                                self.leadPlusWeek(result['attributes']['data']['week']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['week']['plus']);
                                self.leadPlusmonth(result['attributes']['data']['month']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['month']['plus']);
                                self.leadPlustill(result['attributes']['data']['till_now']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['till_now']['plus']);
                                self.leadMinusWeek(result['attributes']['data']['week']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['week']['minus']);
                                self.leadMinusmonth(result['attributes']['data']['month']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['month']['minus']);
                                self.leadMinustill(result['attributes']['data']['till_now']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['till_now']['minus']);
                            }
                        });
                    } else {
                        var getLeadUrl = oj.Model.extend({
                            url: getAllLeads + self.id()
                        });
                        var getLeadFetch = new getLeadUrl();
                        getLeadFetch.fetch({
                            headers: {secret: secret},
                            success: function (res) {
                                var mylead = res['attributes']['data'][0]['manager_id'];
                                var leadSlide = oj.Model.extend({
                                    url: getTopRankersCalendarWise + mylead
                                });
                                var leadSlideFetch = new leadSlide();
                                leadSlideFetch.fetch({
                                    headers: {secret: secret},
                                    success: function (result) {
                                        if (result['attributes']['data']['week']['plus'] == 0 && result['attributes']['data']['week']['minus'] == 0) {
                                            $("#hideSliderWeek").show();
                                            $("#weekSmiley").show();
                                            $("#hideSlider12").hide();
                                        } else {
                                            $("#hideSliderWeek").hide();
                                            $("#weekSmiley").hide();
                                            $("#hideSlider12").show();
                                        }

                                        if (result['attributes']['data']['month']['plus'] == 0 && result['attributes']['data']['month']['minus'] == 0) {
                                            $("#hideMonthSlider").show();
                                            $("#monthSmiley").show();
                                            $("#hideSlider22").hide();
                                        } else {
                                            $("#hideMonthSlider").hide();
                                            $("#monthSmiley").hide();
                                            $("#hideSlider22").show();
                                        }
                                        if (result['attributes']['data']['till_now']['plus'] == 0 && result['attributes']['data']['till_now']['minus'] == 0) {
                                            $("#inner-wrapper1").hide();
                                            $("#noRatingsScreen1").show();
                                            $("#smileyOverAll").show();
                                        } else {
                                            $("#inner-wrapper1").show();
                                            $("#noRatingsScreen1").hide();
                                            $("#smileyOverAll").hide();
                                        }
                                        self.leadPlusWeek(result['attributes']['data']['week']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['week']['plus']);
                                        self.leadPlusmonth(result['attributes']['data']['month']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['month']['plus']);
                                        self.leadPlustill(result['attributes']['data']['till_now']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['till_now']['plus']);
                                        self.leadMinusWeek(result['attributes']['data']['week']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['week']['minus']);
                                        self.leadMinusmonth(result['attributes']['data']['month']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['month']['minus']);
                                        self.leadMinustill(result['attributes']['data']['till_now']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['till_now']['minus']);
                                    }
                                });

                            }
                        });
                    }

                }
// end of the performance slider

                /// +1 performance slider 2nd tab start here
                var personRating = oj.Model.extend({
                    url: getRatingByUser + self.id(),
                    //parse: parseTask
                });
                var record = new personRating();
                record.fetch({
                    headers: {secret: secret},
                    success: function () {
                        var weekUrl = oj.Model.extend({
                            url: getRecentRankingList
                        });
                        var fetchWeek = new weekUrl();
                        fetchWeek.fetch({
                            headers: {secret: secret},
                            success: function (result) {
                                for (var c = 0; c < result['attributes']['data'].length; c++) {
                                    var obj = new Object();
                                    obj.name = result['attributes']['data'][c]['google_name'];
                                    obj.nameS = result['attributes']['data'][c]['google_name'].substring(0, obj.name.indexOf(" "));
                                    obj.image = result['attributes']['data'][c]['google_picture_link'];
                                    obj.projects = result['attributes']['data'][c]['projects'];
                                    obj.personLink = "memberProfile.html?id=" + result['attributes']['data'][c]['user_id'];
                                    self.addteamMembers(obj);
                                }
                                var monthUrl = oj.Model.extend({
                                    url: getTopFourRankForCurrentMonth
                                });
                                var monthFetch = new monthUrl();
                                monthFetch.fetch({
                                    headers: {secret: secret},
                                    success: function (res2) {
                                        for (var c = 0; c < res2['attributes']['data'].length; c++) {
                                            var obj = new Object();
                                            obj.name = res2['attributes']['data'][c]['google_name'];
                                            obj.nameS = res2['attributes']['data'][c]['google_name'].substring(0, obj.name.indexOf(" "));
                                            obj.image = res2['attributes']['data'][c]['image'];
                                            obj.projects = res2['attributes']['data'][c]['projects'];
                                            obj.personLink = "memberProfile.html?id=" + res2['attributes']['data'][c]['user_id'];
                                            self.addteamMembers(obj);
                                        }
                                        var yearUrl = oj.Model.extend({
                                            url: getRankingList
                                        });
                                        var yearFetch = new yearUrl();
                                        yearFetch.fetch({
                                            headers: {secret: secret},
                                            success: function (res3) {
                                                for (var c = 0; c < 4; c++) {
                                                    var obj = new Object();
                                                    obj.personLink = "memberProfile.html?id=" + res3['attributes']['data'][c]['user_id'];
                                                    obj.name = res3['attributes']['data'][c]['google_name'];
                                                    obj.nameS = res3['attributes']['data'][c]['google_name'].substring(0, obj.name.indexOf(" "));
                                                    obj.image = res3['attributes']['data'][c]['image'];
                                                    obj.projects = res3['attributes']['data'][c]['projects'];
                                                    self.addteamMembers(obj);
                                                }
                                            }
                                        });
                                    }
                                });

                            }
                        }); /// +1 performance slider 2nd tab end here.


                        /// rating calculation start here
                        var plus = 0;
                        var dayP = 0;
                        var monthP = 0;
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        var today = yyyy + '-' + mm + '-' + dd;
                        var minus = 0;
                        var dayN = 0;
                        var monthN = 0;
                        var data = record['attributes']['data'];
                        for (var i = 0; i < data.length; i++) {

                            if (data[i]['rating'] == 0) {

                                var createDate = data[i]['created_date'].substr(0, data[i]['created_date'].indexOf(' '));
                                var diff = Math.abs(new Date(today) - new Date(createDate)); //get days in miliseconds
                                diff /= (24 * 60 * 60 * 1000); //convert miliseconds into days

                                if (diff < 7) {
                                    dayN++;
                                }
                                if (diff < 30) {
                                    monthN++;
                                }
                                minus++;
                            } else {
                                if (data[i]['rating'] == 1) {

                                    var createDate = data[i]['created_date'].substr(0, data[i]['created_date'].indexOf(' '));
                                    var diff = Math.abs(new Date(today) - new Date(createDate)); //get days in miliseconds
                                    diff /= (24 * 60 * 60 * 1000); //convert miliseconds into days
                                    if (diff < 7) {
                                        dayP++;
                                    }
                                    if (diff < 30) {
                                        monthP++;
                                    }
                                    plus++;
                                }
                            }
                        }
                        self.myPlusRatings(plus); // over all ratings
                        self.myMinusRatings(minus);
                        if (self.myPlusRatings() == 0 && self.myMinusRatings() == 0) {
                            $('#inner-wrapper').hide();
                            $('#noRatingsScreen').show();
                        } else {
                            self.dayPlusRatings(dayP); // Ratings in this week
                            self.dayMinusRatings(dayN);
                            if (self.dayPlusRatings() == 0 && self.dayMinusRatings() == 0) {
                                self.sliderText1("You have not been rated this week!!");
                                $('#hideSlider1').hide();
                                $('#hidegreenBtn1').hide();
                                $('#hideredBtn1').hide();
                                $('#smiley1').show();
                            } else {

                                $('#hideSlider1').show();
                                $('#hidegreenBtn1').show();
                                $('#hideredBtn1').show();
                                $('#smiley1').hide();
                            }
                            self.monthPlusRatings(monthP); //ratings in this Month
                            self.monthMinusRatings(monthN);

                            if (self.monthPlusRatings() == 0 && self.monthMinusRatings() == 0) {
                                self.sliderText2("You have not been rated this month!!");
                                $('#hideSlider2').hide();
                                $('#hidegreenBtn2').hide();
                                $('#hideredBtn2').hide();
                                $('#smiley2').show();
                            } else {
                                $('#hideSlider2').show();
                                $('#hidegreenBtn2').show();
                                $('#hideredBtn2').show();
                                $('#smiley2').hide();
                            }
                            self.myPlusRatings(plus); // over all ratings
                            self.myMinusRatings(minus);
                            if (self.myPlusRatings() == 0 && self.myMinusRatings() == 0) {
                                self.sliderText3("You have not been rated yet!!");
                                $('#hideSlider3').hide();
                                $('#hidegreenBtn3').hide();
                                $('#hideredBtn3').hide();
                                $('#smiley3').show();
                            } else {
                                $('#hideSlider3').show();
                                $('#hidegreenBtn3').show();
                                $('#hideredBtn3').show();
                                $('#smiley3').hide();
                            }
                        }
                        
                                 self.dayPlusRatings(dayP == 0 ? 0 : "+" + dayP);
                                 self.dayMinusRatings(dayN == 0 ? 0 : "+" + dayN);
                                 self.monthPlusRatings(monthP == 0 ? 0 : "+" + monthP);
                                 self.monthMinusRatings(monthN == 0 ? 0 : "-" + monthN);
                                 self.myPlusRatings(plus== 0 ? 0 : "-" + plus);
                                 self.myMinusRatings(minus== 0 ? 0 : "-" + minus);
                        
                        /// rating calculation end here
                    }
                });
            }
        });
//        var counter = 1;//automatic slider counter
//
//        setInterval(function () {
//            if (counter % 3 == 0) {
//                document.getElementsByName("slide")[0].checked = true;
//                document.getElementsByName("slide")[1].checked = false;
//                document.getElementsByName("slide")[2].checked = false;
//                document.getElementsByName("slide1")[0].checked = true;
//                document.getElementsByName("slide1")[1].checked = false;
//                document.getElementsByName("slide1")[2].checked = false;
//
//                counter = 0;
//            }
//            if (counter % 3 == 1) {
//                document.getElementsByName("slide")[0].checked = false;
//                document.getElementsByName("slide")[1].checked = true;
//                document.getElementsByName("slide")[2].checked = false;
//                document.getElementsByName("slide1")[0].checked = false;
//                document.getElementsByName("slide1")[1].checked = true;
//                document.getElementsByName("slide1")[2].checked = false;
//
//            }
//            if (counter % 3 == 2) {
//                document.getElementsByName("slide")[0].checked = false;
//                document.getElementsByName("slide")[1].checked = false;
//                document.getElementsByName("slide")[2].checked = true;
//                document.getElementsByName("slide1")[0].checked = false;
//                document.getElementsByName("slide1")[1].checked = false;
//                document.getElementsByName("slide1")[2].checked = true;
//
//            }
//            counter++;
//			 if ($("#filmStrip").find("#ui-id-9").attr("style") == "visibility: hidden;")
//               $( "#filmStrip" ).ojFilmStrip( "option", "currentItem", 1 );
//            else {
//                $("#filmStrip").find("#ui-id-9").click();
//            }
//
//        }, 6000)
//

        setTimeout(function () {
                    $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team.png" alt="" />');
                    
                     $( "#homeTab2" ).click(function() {
                          if($('#homeTab2 > img').attr("src")=="../../images/team.png"){
                          $('#homeTab1 > img').remove();
                          $('#homeTab2 > img').remove();
                          $('#homeTab1').append(' <img src="../../images/user.png" alt="" />');
                          $('#homeTab2').append(' <img src="../../images/team-active.png" alt="" />');
                      }
                     });
                         
                     $( "#home2" ).click(function() {
                          if($('#homeTab2 > img').attr("src")=="../../images/team.png"){
                          $('#homeTab1 > img').remove();
                          $('#homeTab2 > img').remove();
                          $('#homeTab1').append(' <img src="../../images/user.png" alt="" />');
                          $('#homeTab2').append(' <img src="../../images/team-active.png" alt="" />');
                      }
                     });
                     
                       $( "#homeTab1" ).click(function() {
                          if($('#homeTab1 > img').attr("src")=="../../images/user.png"){
                          $('#homeTab1 > img').remove();
                          $('#homeTab2 > img').remove();
                          $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
                          $('#homeTab2').append(' <img src="../../images/team.png" alt="" />');
                      }
                     });
                         
                     $( "#home1" ).click(function() {
                         if($('#homeTab1 > img').attr("src")=="../../images/user.png"){
                          $('#homeTab1 > img').remove();
                          $('#homeTab2 > img').remove();
                          $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
                          $('#homeTab2').append(' <img src="../../images/team.png" alt="" />');
                      }
                     });
                      
        }, 500);

    }

    return homeContentViewModel;
});

