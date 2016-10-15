/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * ratings module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function rating(plus, minus) {
        this.plus = plus;
        this.minus = minus;
        return this;
    }
    function ratingsContentViewModel(userId) {
        var self = this;
        userId = 2;
        self.myPlusRatings = ko.observable();
        self.myMinusRatings =ko.observable();
        
        var TaskRecord = oj.Model.extend({
            url: "http://dev.parakh.com/parakh-new/v1/index.php/getRatingByUser/" + userId,
            //parse: parseTask
        });
        
        var task = new TaskRecord();
        
        task.fetch({
            headers: {secret: 'parakh-revamp-local-key-2016'},
            success: function (res) {
                var plus =0;
                var minus =0;
                var data = res['attributes']['data'];
                for (var i = 0; i < data.length; i++) {

                    if (data[i]['rating'] == 0) {
                        minus++;
                    } else {
                        if (data[i]['rating'] == 1)
                            plus++;
                    }
                }
                self.myMinusRatings = minus;
                self.myPlusRatings = plus;
            }
        });
        
    }
    return ratingsContentViewModel;
});
