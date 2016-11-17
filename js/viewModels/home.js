/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtabs', 'ojs/ojconveyorbelt'
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
                 var person0 = "memberProfile.html?id="+data.attributes['data'][0]['user_id']; 
                self.link0(person0);

                var img1 = data.attributes['data'][1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][1]['google_picture_link'];
                self.name1(data.attributes['data'][1]['google_name'].substr(0, data.attributes['data'][1]['google_name'].indexOf(' ')));
                self.name1hover(data.attributes['data'][1]['google_name']);
                self.project1hover(data.attributes['data'][1]['project_name']);
                self.image1(img1);
                 var person1 = "memberProfile.html?id="+data.attributes['data'][1]['user_id']; 
                self.link1(person1);

                var img2 = data.attributes['data'][2]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][2]['google_picture_link'];
                self.name2(data.attributes['data'][2]['google_name'].substr(0, data.attributes['data'][2]['google_name'].indexOf(' ')));
                self.name2hover(data.attributes['data'][2]['google_name']);
                self.project2hover(data.attributes['data'][2]['project_name']);
                self.image2(img2);
                 var person2 = "memberProfile.html?id="+data.attributes['data'][2]['user_id']; 
                self.link2(person2);

                var img3 = data.attributes['data'][3]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][3]['google_picture_link'];
                self.name3(data.attributes['data'][3]['google_name'].substr(0, data.attributes['data'][3]['google_name'].indexOf(' ')));
                self.name3hover(data.attributes['data'][3]['google_name']);
                self.project3hover(data.attributes['data'][3]['project_name']);
                self.image3(img3);
                var person3 = "memberProfile.html?id="+data.attributes['data'][3]['user_id']; 
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
               var view = "profile.html?id="+viewProfile.attributes['data']['id']; 
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

                    counter = 0;
                }
                if (counter % 3 == 1) {
                    document.getElementsByName("slide")[0].checked = false;
                    document.getElementsByName("slide")[1].checked = true;
                    document.getElementsByName("slide")[2].checked = false;

                }
                if (counter % 3 == 2) {
                    document.getElementsByName("slide")[0].checked = false;
                    document.getElementsByName("slide")[1].checked = false;
                    document.getElementsByName("slide")[2].checked = true;

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

