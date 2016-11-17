/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtabs', 'ojs/ojfilmstrip'
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
                self.project0hover(data.attributes['data'][0]['project_name']);
                self.image0(img0);

                var img1 = data.attributes['data'][1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][1]['google_picture_link'];
                self.name1(data.attributes['data'][1]['google_name'].substr(0, data.attributes['data'][1]['google_name'].indexOf(' ')));
                self.name1hover(data.attributes['data'][1]['google_name']);
                self.project1hover(data.attributes['data'][1]['project_name']);
                self.image1(img1);

                var img2 = data.attributes['data'][2]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][2]['google_picture_link'];
                self.name2(data.attributes['data'][2]['google_name'].substr(0, data.attributes['data'][2]['google_name'].indexOf(' ')));
                self.name2hover(data.attributes['data'][2]['google_name']);
                self.project2hover(data.attributes['data'][2]['project_name']);
                self.image2(img2);

                var img3 = data.attributes['data'][3]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][3]['google_picture_link'];
                self.name3(data.attributes['data'][3]['google_name'].substr(0, data.attributes['data'][3]['google_name'].indexOf(' ')));
                self.name3hover(data.attributes['data'][3]['google_name']);
                self.project3hover(data.attributes['data'][3]['project_name']);
                self.image3(img3);

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

        //slider +1 performance
        self.chemicals = [
            {name: 'Hydrogen'},
            {name: 'Helium'},
            {name: 'Lithium'},
            {name: 'Beryllium'},
            {name: 'Boron'},
            {name: 'Carbon'},
            {name: 'Carbon'},
            {name: 'Carbon'},
            {name: 'Carbon'},
            {name: 'Carbon'},
            {name: 'Carbon'},
            {name: 'Carbon'},
            {name: 'Carbon'}
        ];
        self.chemical_clone = ko.observableArray();

        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");

        getItemInitialDisplay = function (index)
        {
            return index < 4 ? '' : 'none';
        };
        var recentMemberURL = oj.Model.extend({
            url: getUserByEmail + person['email']
                    //parse: parseTask
        });
        var task1 = new recentMemberURL();
        task1.fetch({
            headers: {secret: secret},
            success: function () {
                self.id(task1.attributes['data']['id']);
                var weekUrl = oj.Model.extend({
                    url: getRecentRankingList
                            //parse: parseTask
                });
                var fetchWeek = new weekUrl();
                fetchWeek.fetch({
                    headers: {secret: secret},
                    success: function (result) {
                        for (var c = 0; c < result['attributes']['data'].length; c++) {
                            var obj = new Object();
                            obj.name = result['attributes']['data'][c]['google_name'];
                            self.chemical_clone.push(obj);
                        }
                        var monthUrl = oj.Model.extend({
                            url: getRecentRankingList
                                    //parse: parseTask
                        });
                        var monthFetch = new monthUrl();
                        monthFetch.fetch({
                            headers: {secret: secret},
                            success: function (res2) {
                                for (var c = 0; c < res2['attributes']['data'].length; c++) {
                                    var obj = new Object();
                                    obj.name = res2['attributes']['data'][c]['google_name'];
                                    self.chemical_clone.push(obj);
                                }
                                var yearUrl = oj.Model.extend({
                                    url: getRecentRankingList
                                            //parse: parseTask
                                });
                                var yearFetch = new yearUrl();
                                yearFetch.fetch({
                                    headers: {secret: secret},
                                    success: function (res3) {
                                        for (var c = 0; c < res3['attributes']['data'].length; c++) {
                                            var obj = new Object();
                                            obj.name = res3['attributes']['data'][c]['google_name'];
                                            self.chemical_clone.push(obj);
                                        }
                                        console.log(self.chemical_clone());
                                    }
                                });
                            }
                        });

                    }
                });
            }
        });
        //slider performance +1 end


        var TaskRecord = oj.Model.extend({
            url: getUserByEmail + person['email'],
            //parse: parseTask
        });
        var task = new TaskRecord();
        task.fetch({
            headers: {secret: secret},
            success: function () {
                self.id(task.attributes['data']['id']);
                var personRating = oj.Model.extend({
                    url: getRatingByUser + self.id(),
                    //parse: parseTask
                });
                var record = new personRating();
                record.fetch({
                    headers: {secret: secret},
                    success: function () {
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
                                        //           console.log(dayP);
                                    }
                                    if (diff < 30) {
                                        monthP++;
                                        //     console.log(monthP);
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
                                $('#hideSlider1,#hideSlider12').hide();
                                $('#hidegreenBtn1,#hidegreenBtn12').hide();
                                $('#hideredBtn1,#hideredBtn12').hide();
                                $('#smiley1,#smiley12').show();
                            } else {

                                $('#hideSlider1,#hideSlider12').show();
                                $('#hidegreenBtn1,#hidegreenBtn12').show();
                                $('#hideredBtn1,#hideredBtn12').show();
                                $('#smiley1,#smiley12').hide();
                            }
                            self.monthPlusRatings(monthP); //ratings in this Month
                            self.monthMinusRatings(monthN);

                            if (self.monthPlusRatings() == 0 && self.monthMinusRatings() == 0) {
                                self.sliderText2("You have not been rated this month!!");
                                $('#hideSlider2,#hideSlider22').hide();
                                $('#hidegreenBtn2,#hidegreenBtn22').hide();
                                $('#hideredBtn2,#hideredBtn22').hide();
                                $('#smiley2,#smiley22').show();
                            } else {
                                $('#hideSlider2,#hideSlider22').show();
                                $('#hidegreenBtn2,#hidegreenBtn22').show();
                                $('#hideredBtn2,#hideredBtn22').show();
                                $('#smiley2,#smiley22').hide();
                            }
                            self.myPlusRatings(plus); // over all ratings
                            self.myMinusRatings(minus);
                            if (self.myPlusRatings() == 0 && self.myMinusRatings() == 0) {
                                self.sliderText3("You have not been rated yet!!");
                                $('#hideSlider3,#hideSlider32').hide();
                                $('#hidegreenBtn3,#hidegreenBtn32').hide();
                                $('#hideredBtn3,#hideredBtn32').hide();
                                $('#smiley3,#smiley32').show();
                            } else {
                                $('#hideSlider3,#hideSlider32').show();
                                $('#hidegreenBtn3,#hidegreenBtn32').show();
                                $('#hideredBtn3,#hideredBtn32').show();
                                $('#smiley3,#smiley32').hide();
                            }
                        }
                    }
                });
            }
        });
        var counter = 1;//automatic slider counter

        setInterval(function () {
            if (counter % 3 == 0) {
                document.getElementsByName("slide")[0].checked = true;
                document.getElementsByName("slide")[1].checked = false;
                document.getElementsByName("slide")[2].checked = false;
                document.getElementsByName("slide1")[0].checked = true;
                document.getElementsByName("slide1")[1].checked = false;
                document.getElementsByName("slide1")[2].checked = false;

                counter = 0;
            }
            if (counter % 3 == 1) {
                document.getElementsByName("slide")[0].checked = false;
                document.getElementsByName("slide")[1].checked = true;
                document.getElementsByName("slide")[2].checked = false;
                document.getElementsByName("slide1")[0].checked = false;
                document.getElementsByName("slide1")[1].checked = true;
                document.getElementsByName("slide1")[2].checked = false;

            }
            if (counter % 3 == 2) {
                document.getElementsByName("slide")[0].checked = false;
                document.getElementsByName("slide")[1].checked = false;
                document.getElementsByName("slide")[2].checked = true;
                document.getElementsByName("slide1")[0].checked = false;
                document.getElementsByName("slide1")[1].checked = false;
                document.getElementsByName("slide1")[2].checked = true;

            }
            counter++;

        }, 6000)


        setTimeout(function () {
            $(".tabIcon").click(function () {
                $(".tabIcon").removeClass('oj-tabs-title-active');
                $(this).addClass('oj-tabs-title-active');
            });
        }, 500);

    }

    return homeContentViewModel;
});


