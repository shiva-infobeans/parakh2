/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * feedback module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function feedbackContentViewModel(person) {
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
//         get members who get +1 recently
        var rec = oj.Model.extend({
            url: getRecentRankingList
        });
        var data = new rec();
        data.fetch({
            headers: {secret: secret},
            success: function () {
//                assgning values to the varibles.
                self.name0(data.attributes['data'][0]['google_name']);
                self.image0(data.attributes['data'][0]['google_picture_link']);


                self.name1(data.attributes['data'][1]['google_name']);
                self.image1(data.attributes['data'][1]['google_picture_link']);

                self.name2(data.attributes['data'][2]['google_name']);
                self.image2(data.attributes['data'][2]['google_picture_link']);

                self.name3(data.attributes['data'][3]['google_name']);
                self.image3(data.attributes['data'][3]['google_picture_link']);

            }
        });
    }

    return feedbackContentViewModel;
});
