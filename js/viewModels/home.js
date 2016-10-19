/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function homeContentViewModel(person) {
        var self = this;
        this.memberName = person['name'].substr(0, person['name'].indexOf(' '));
        this.id = ko.observable();

        this.dayPlusRatings = ko.observable(0); //for this week
        this.dayMinusRatings = ko.observable(0);

        this.monthPlusRatings = ko.observable(0); //for this month
        this.monthMinusRatings = ko.observable(0);

        this.myPlusRatings = ko.observable(0);
        this.myMinusRatings = ko.observable(0);
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
                        var dayP=0;
                        var monthP=0;
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
                                        console.log(dayP);
                                    }
                                    if (diff < 30) {
                                        monthP++;
                                        console.log(monthP);
                                    }
                                    plus++;
                                }
                            }
                        }
                        self.myPlusRatings(plus); // over all ratings
                        self.myMinusRatings(minus);
                        
                        self.dayPlusRatings(dayP); // Ratings in this week
                        self.dayMinusRatings(dayN);
                        
                        self.monthPlusRatings(monthP); //ratings in this Month
                        self.monthMinusRatings(monthN);
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
    }

    return homeContentViewModel;
});


