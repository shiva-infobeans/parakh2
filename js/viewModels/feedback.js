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
        self.image1 = ko.observable();//"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ_19Goz1xYBq9yP1P-VhvxouqqdbiY3uvyfRz5hY26fSTOWaEu";
        self.name1 = ko.observable();//"ABHINAV SHRIVASTAVA";
        self.designation1 = ko.observable();//"Practice head";
        self.comment1 = ko.observable()//"You got +1 by Abhinav Shrivastava";
        self.image2 = ko.observable();//"http://previews.123rf.com/images/gmast3r/gmast3r1504/gmast3r150400166/38548354-profile-icon-male-hispanic-avatar-portrait-casual-Stock-Vector.jpg";
        self.name2 = ko.observable();//"ABHINAV SHRIVASTAVA";
        self.designation2 = ko.observable();//"Practice head";
        self.comment2 = ko.observable();//"You got +1 by Abhinav Shrivastava";
        self.image3 = ko.observable();//"https://lh6.googleusercontent.com/-HQ_vIGvk7Po/AAAAAAAAAAI/AAAAAAAAAB0/25YNHGaDVLI/photo.jpg";
        self.name3 = ko.observable();//"ABHINAV SHRIVASTAVA";
        self.designation3 = ko.observable();//"Practice head";
        self.comment3 = ko.observable();//"You got +1 by Abhinav Shrivastava";

        
                //http://dev.parakh.com/parakh-new/v1/index.php/getRecentRatingingList/
                var rec = oj.Model.extend({
                    url: "http://dev.parakh.com/parakh-new/v1/index.php/getRecentRatingingList/"
                    //parse: parseTask
                });
                var data = new rec();
                data.fetch({
                    headers: {secret: 'parakh-revamp-local-key-2016'},
                    success: function () {
//                        console.log(data.attributes['data'][0]);
                        self.name1(data.attributes['data'][0]['google_name']);
                        self.image1(data.attributes['data'][0]['google_picture_link']);
                        self.designation1(data.attributes['data'][0]['designation']);
                        self.comment1(data.attributes['data'][0]['description']);
                        
                        self.name2(data.attributes['data'][1]['google_name']);
                        self.image2(data.attributes['data'][1]['google_picture_link']);
                        self.designation2(data.attributes['data'][1]['designation']);
                        self.comment2(data.attributes['data'][1]['description']);
                        
                        self.name3(data.attributes['data'][2]['google_name']);
                        self.image3(data.attributes['data'][2]['google_picture_link']);
                        self.designation3(data.attributes['data'][2]['designation']);
                        self.comment3(data.attributes['data'][2]['description']);
                        
                    }
                });
    }

    return feedbackContentViewModel;
});
