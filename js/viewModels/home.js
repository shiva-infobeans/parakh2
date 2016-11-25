/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodel', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtabs', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol'
], function (oj, ko, $) {
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

// Slider 0 replace.............start(my slider)
        self.mySlider = ko.observableArray([]);
        self.pagingModel10 = null;
        self.pagingModel10 = null;

        getItemInitialDisplay10 = function (index)
        {
            return index < 1 ? '' : 'none';
        };

        getPagingModel10 = function ()
        {
            if (!self.pagingModel10)
            {
                var filmStrip = $("#filmStrip10");
                var pagingModel = filmStrip.ojFilmStrip("getPagingModel");
                self.pagingModel10 = pagingModel;
            }
            return self.pagingModel10;
        };

        self.addMySlider = function (obj) {
            self.mySlider.push(obj);
            $('#filmStrip10').ojFilmStrip("refresh");
        }

// Slider 0 replace.............end(my slider)

// slider 1 replace.............start(my team)

        self.leadSlider = ko.observableArray([
        ]);
        self.pagingModel12 = null;

        getItemInitialDisplay12 = function (index)
        {
            return index < 1 ? '' : 'none';
        };

        getPagingModel12 = function ()
        {
            if (!self.pagingModel12)
            {
                var filmStrip = $("#filmStrip12");
                var pagingModel = filmStrip.ojFilmStrip("getPagingModel");
                self.pagingModel12 = pagingModel;
            }
            return self.pagingModel12;
        };

        self.addLeadSlider = function (obj) {
            self.leadSlider.push(obj);
            $('#filmStrip12').ojFilmStrip("refresh");
        }




// slider 1 replace.............end(my team)

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
                    $("#mangerSlider1").hide();
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
                                var obj1 = new Object();
                                var obj2 = new Object();
                                var obj3 = new Object();
                                obj1.leadPlus12 = result['attributes']['data']['week']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['week']['plus'];
                                obj1.leadMinus12 = result['attributes']['data']['week']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['week']['minus'];
                                obj1.performanceTxt = "My Team’s Performance for this week…";
                                obj1.noRatingTxt = "Your team has not been rated this week!!";
                                obj2.leadPlus12 = result['attributes']['data']['month']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['month']['plus'];
                                obj2.leadMinus12 = result['attributes']['data']['month']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['month']['minus'];
                                obj2.performanceTxt = "My Team’s Performance for this month…";
                                obj2.noRatingTxt = "Your team has not been rated this month!!";
                                obj3.leadPlus12 = result['attributes']['data']['till_now']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['till_now']['plus'];
                                obj3.leadMinus12 = result['attributes']['data']['till_now']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['till_now']['minus'];
                                obj3.performanceTxt = "My Team’s Performance till now…";
                                obj3.noRatingTxt = "Your team has not been rated till now!!";

                                if (obj3.leadPlus12 == 0 && obj3.leadMinus12 == 0) {
                                    self.addLeadSlider(obj3);
                                    $("#showSlider0").hide();
                                    $("#noRating0").show();

                                } else {
                                    self.addLeadSlider(obj1);
                                    self.addLeadSlider(obj2);
                                    self.addLeadSlider(obj3);
                                    if (obj1.leadPlus12 == 0 && obj1.leadMinus12 == 0) {
                                        $("#showSlider0").hide();
                                        $("#noRating0").show();
                                    } else {
                                        $("#noRating0").hide();
                                    }
                                    if (obj2.leadPlus12 == 0 && obj2.leadMinus12 == 0) {
                                        $("#showSlider1").hide();
                                        $("#noRating1").show();
                                    } else {
                                        $("#noRating1").hide();
                                    }
                                    $("#noRating2").hide();

                                }
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
                                        var obj1 = new Object();
                                        var obj2 = new Object();
                                        var obj3 = new Object();
                                        obj1.leadPlus12 = result['attributes']['data']['week']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['week']['plus'];
                                        obj1.leadMinus12 = result['attributes']['data']['week']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['week']['minus'];
                                        obj1.performanceTxt = "My Team’s Performance for this week…";
                                        obj1.noRatingTxt = "Your team has not been rated this week!!";
                                        obj2.leadPlus12 = result['attributes']['data']['month']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['month']['plus'];
                                        obj2.leadMinus12 = result['attributes']['data']['month']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['month']['minus'];
                                        obj2.performanceTxt = "My Team’s Performance for this month…";
                                        obj2.noRatingTxt = "Your team has not been rated this month!!";
                                        obj3.leadPlus12 = result['attributes']['data']['till_now']['plus'] == 0 ? 0 : "+" + result['attributes']['data']['till_now']['plus'];
                                        obj3.leadMinus12 = result['attributes']['data']['till_now']['minus'] == 0 ? 0 : "-" + result['attributes']['data']['till_now']['minus'];
                                        obj3.performanceTxt = "My Team’s Performance till now…";
                                        obj3.noRatingTxt = "Your team has not been rated till now!!";

                                        if (obj3.leadPlus12 == 0 && obj3.leadMinus12 == 0) {
                                            self.addLeadSlider(obj3);
                                            $("#showSlider0").hide();
                                            $("#noRating0").show();

                                        } else {
                                            self.addLeadSlider(obj1);
                                            self.addLeadSlider(obj2);
                                            self.addLeadSlider(obj3);
                                            if (obj1.leadPlus12 == 0 && obj1.leadMinus12 == 0) {
                                                $("#showSlider0").hide();
                                                $("#noRating0").show();
                                            } else {
                                                $("#noRating0").hide();
                                            }
                                            if (obj2.leadPlus12 == 0 && obj2.leadMinus12 == 0) {
                                                $("#showSlider1").hide();
                                                $("#noRating1").show();
                                            } else {
                                                $("#noRating1").hide();
                                            }
                                            $("#noRating2").hide();

                                        }

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
                                    obj.projects = result['attributes']['data'][c]['primary_project'];
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
                                            obj.projects = res2['attributes']['data'][c]['primary_project'];
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
                                                    obj.projects = res3['attributes']['data'][c]['primary_project'];
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
                        // rating slider change for user start here
                        var obj1 = new Object();
                        var obj2 = new Object();
                        var obj3 = new Object();
                        obj1.leadPlus12 = dayP == 0 ? 0 : "+" + dayP;
                        obj1.leadMinus12 = dayN == 0 ? 0 : "-" + dayN;
                        obj1.performanceTxt = "Your performance for this week...";
                        obj1.noRatingTxt = "You have not been rated this week!!";
                        obj2.leadPlus12 = monthP == 0 ? 0 : "+" + monthP;
                        obj2.leadMinus12 = monthN == 0 ? 0 : "-" + monthN;
                        obj2.performanceTxt = "Your performance for this month...";
                        obj2.noRatingTxt = "You have not been rated this month!!";
                        obj3.leadPlus12 = plus == 0 ? 0 : "+" + plus;
                        obj3.leadMinus12 = minus == 0 ? 0 : "-" + minus;
                        obj3.performanceTxt = "Your performance up to now...";
                        obj3.noRatingTxt = "You have not been rated yet!!";

                        if (obj3.leadPlus12 == 0 && obj3.leadMinus12 == 0) {
                            self.addMySlider(obj3);
                            $("#showSlider10").hide();
                            $("#noRating10").show();

                        } else {
                            self.addMySlider(obj1);
                            self.addMySlider(obj2);
                            self.addMySlider(obj3);

                            if (obj1.leadPlus12 == 0 && obj1.leadMinus12 == 0) {
                                $("#showSlider10").hide();
                                $("#noRating10").show();
                            } else {
                                $("#noRating10").hide();
                            }
                            if (obj2.leadPlus12 == 0 && obj2.leadMinus12 == 0) {
                                $("#showSlider11").hide();
                                $("#noRating11").show();
                            } else {
                                $("#noRating11").hide();
                            }
                            $("#noRating12").hide();
                        }

                        // rating slider change for user end here


                        /// rating calculation end here
                    }
                });
            }
        });


        setInterval(function () {



            if ($("#filmStrip").find("#ui-id-9").attr("style") == "visibility: hidden;") {
                $("#filmStrip").ojFilmStrip("option", "currentItem", 0);
            } else {
                $("#filmStrip").find("#ui-id-9").click();
            }

            /// slider my team
            if ($('#filmStrip12').ojFilmStrip("option", "currentItem") == 0
                    || $('#filmStrip12').ojFilmStrip("option", "currentItem") == 'show0') {
                try {
                    $('#filmStrip12').ojFilmStrip("option", "currentItem", 1);
                } catch (e)
                {
                    //console.log(e);
                }

            } else if ($('#filmStrip12').ojFilmStrip("option", "currentItem") == 1
                    || $('#filmStrip12').ojFilmStrip("option", "currentItem") == 'show1') {
                try {
                    $('#filmStrip12').ojFilmStrip("option", "currentItem", 2);
                } catch (e)
                {
                    //console.log(e);
                }
            } else if ($('#filmStrip12').ojFilmStrip("option", "currentItem") == 'show2') {
                try {
                    $('#filmStrip12').ojFilmStrip("option", "currentItem", 0);
                } catch (e)
                {
                    //console.log(e);
                }
            }

            /// my slider
            if ($('#filmStrip10').ojFilmStrip("option", "currentItem") == 0
                    || $('#filmStrip10').ojFilmStrip("option", "currentItem") == 'show10') {
                try {
                    $('#filmStrip10').ojFilmStrip("option", "currentItem", 1);
                    
                } catch (e)
                {
                    console.log(e);
                }
            } else if ($('#filmStrip10').ojFilmStrip("option", "currentItem") == 1
                    || $('#filmStrip10').ojFilmStrip("option", "currentItem") == 'show11') {
                try {
                    $('#filmStrip10').ojFilmStrip("option", "currentItem", 2);
                } catch (e)
                {
                    console.log(e);
                }
            } else if ($('#filmStrip10').ojFilmStrip("option", "currentItem") == 2
                    || $('#filmStrip10').ojFilmStrip("option", "currentItem") == 'show12') {

                try {
                    $('#filmStrip10').ojFilmStrip("option", "currentItem", 0);
                } catch (e)
                {
                    console.log(e);
                }
            }
 /// manager slider
//            if ($('#filmStrip10').ojFilmStrip("option", "currentItem") == 0
//                    || $('#filmStrip10').ojFilmStrip("option", "currentItem") == 'show10') {
//                try {
//                    $('#filmStrip10').ojFilmStrip("option", "currentItem", 1);
//                    
//                } catch (e)
//                {
//                    
//                }
//            } else if ($('#filmStrip10').ojFilmStrip("option", "currentItem") == 1
//                    || $('#filmStrip10').ojFilmStrip("option", "currentItem") == 'show11') {
//                try {
//                    $('#filmStrip10').ojFilmStrip("option", "currentItem", 2);
//                } catch (e)
//                {
//                    
//                }
//            } else if ($('#filmStrip10').ojFilmStrip("option", "currentItem") == 2
//                    || $('#filmStrip10').ojFilmStrip("option", "currentItem") == 'show12') {
//
//                try {
//                    $('#filmStrip10').ojFilmStrip("option", "currentItem", 0);
//                } catch (e)
//                {
//                    
//                }
//            }
            
        }, 6000)

        setTimeout(function () {
            $("#filmStrip").on({
                'ojoptionchange': function (event, data) {
                    // verify that the component firing the event is a component of interest
                    if ($(event.target).is("#filmStrip")) {
                        if ($("#filmStrip").ojFilmStrip("option", "currentItem") == 1) {
                            $("#plusSliderTxt").text("Recent +1 Ratings");
                        }
                        ;
                        if ($("#filmStrip").ojFilmStrip("option", "currentItem") == 4) {
                            $("#plusSliderTxt").text("Monthly Highest +1 Ratings");
                        }
                        ;
                        if ($("#filmStrip").ojFilmStrip("option", "currentItem") == 8) {
                            $("#plusSliderTxt").text("Overall Highest +1 Rating");
                        }
                        ;
                    }
                }
            });
            $("#plusSliderTxt").text("Recent +1 Ratings");// slider text for +1 rating.
            $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
            $('#homeTab2').append(' <img src="../../images/team.png" alt="" />');

            $("#homeTab2").click(function () {
                if ($('#homeTab2 > img').attr("src") == "../../images/team.png") {
                    $('#homeTab1 > img').remove();
                    $('#homeTab2 > img').remove();
                    $('#homeTab1').append(' <img src="../../images/user.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team-active.png" alt="" />');
                }
            });

            $("#home2").click(function () {
                if ($('#homeTab2 > img').attr("src") == "../../images/team.png") {
                    $('#homeTab1 > img').remove();
                    $('#homeTab2 > img').remove();
                    $('#homeTab1').append(' <img src="../../images/user.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team-active.png" alt="" />');
                }
            });

            $("#homeTab1").click(function () {
                if ($('#homeTab1 > img').attr("src") == "../../images/user.png") {
                    $('#homeTab1 > img').remove();
                    $('#homeTab2 > img').remove();
                    $('#homeTab1').append(' <img src="../../images/user-active.png" alt="" />');
                    $('#homeTab2').append(' <img src="../../images/team.png" alt="" />');
                }
            });

            $("#home1").click(function () {
                if ($('#homeTab1 > img').attr("src") == "../../images/user.png") {
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

