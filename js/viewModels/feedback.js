/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * feedback module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel', 'ojs/ojfilmstrip'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function recentRatingSlider(data){
        var sliderData = new Object();
        sliderData.name = data['name'];
        sliderData.img = data['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data['google_picture_link'];
        return sliderData;
    }
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
        self.teamRecentOne = ko.observableArray();
        self.chemicals = ko.observableArray();
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
                self.name0(data.attributes['data'][0]['google_name']);
                self.image0(img0);
                self.image0(img0);

                var img1 = data.attributes['data'][1]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][1]['google_picture_link'];
                self.name1(data.attributes['data'][1]['google_name']);
                self.image1(img1);

                var img2 = data.attributes['data'][2]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][2]['google_picture_link'];
                self.name2(data.attributes['data'][2]['google_name']);
                self.image2(img2);

                var img3 = data.attributes['data'][3]['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data.attributes['data'][3]['google_picture_link'];
                self.name3(data.attributes['data'][3]['google_name']);
                self.image3(img3);

                for (var c = 0; c < 12; c++) {
                    self.teamRecentOne.push(new recentRatingSlider(data.attributes['data'][0]));
                    self.chemicals.push(new recentRatingSlider(data.attributes['data'][0]));
                }
                console.log(self.teamRecentOne());
                console.log(self.chemicals());
            }
        });

        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");

        getItemInitialDisplay = function (index)
        {
            return index < 4 ? '' : 'none';
        };
        
//        self.chemicals([
//            {name: 'Hydrogen',img:'123'},
//            {name: 'Helium',img:'123'},
//            {name: 'Lithium',img:'123'},
//            {name: 'Beryllium',img:'123'},
//            {name: 'Boron',img:'123'},
//            {name: 'Carbon',img:'123'},
//            {name: 'Nitrogen',img:'123'},
//            {name: 'Oxygen',img:'123'},
//            {name: 'Fluorine',img:'123'},
//            {name: 'Neon',img:'123'},
//            {name: 'Sodium',img:'123'},
//            {name: 'Magnesium',img:'123'}
//        ]);
    }

    return feedbackContentViewModel;
});
