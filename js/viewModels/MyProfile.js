/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * test module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'ojs/ojcomponentcore','ojs/ojmodel'
], function (oj, ko)
{
    function testContentViewModel(person) {
        var self = this;
        this.pic = person['pic'];
        this.plus = ko.observable();
        this.minus = ko.observable();
        this.myname = person['name'];
        this.email = person['email'];
        var abc = "Not Assigned";
        self.id = ko.observable(0);

        this.designation = ko.observable(abc);
        var TaskRecord = oj.Model.extend({
            url: getUserByEmail + person['email'],
            //parse: parseTask
        });
        var task = new TaskRecord();
        task.fetch({
            headers: {secret: secret},
            success: function () {
                abc = task.attributes['data']['designation'];
                self.id(task.attributes['data']['id']);
                self.designation(abc);

                var rate = oj.Model.extend({
                    url: getRatingByUser + self.id(),
                    //parse: parseTask
                });

                var rateTask = new rate();

                rateTask.fetch({
                    headers: {secret: secret},
                    success: function (res) {
                        var plus = 0;
                        var minus = 0;
                        var data = res['attributes']['data'];
                        for (var i = 0; i < data.length; i++) {

                            if (data[i]['rating'] == 0) {
                                minus++;
                            } else {
                                if (data[i]['rating'] == 1)
                                    plus++;
                            }
                        }

                        self.plus(plus);
                        self.minus(minus);
                    }
                });
            }
        });

    }

    return testContentViewModel;
});


