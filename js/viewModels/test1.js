/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * test1 module
 */
define(['ojs/ojcore', 'knockout','ojs/ojmodel'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */

    function test1ContentViewModel(person) {
        var self = this;
        self.id= ko.observable();
        self.image1 = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ_19Goz1xYBq9yP1P-VhvxouqqdbiY3uvyfRz5hY26fSTOWaEu";
        self.name1 = "ABHINAV SHRIVASTAVA";
        self.designation1 = "Practice head";
        self.comment1 = "You got +1 by Abhinav Shrivastava";
        self.image2 = "http://previews.123rf.com/images/gmast3r/gmast3r1504/gmast3r150400166/38548354-profile-icon-male-hispanic-avatar-portrait-casual-Stock-Vector.jpg";
        self.name2 = "ABHINAV SHRIVASTAVA";
        self.designation2 = "Practice head";
        self.comment2 = "You got +1 by Abhinav Shrivastava";
        self.image3 = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ6J33chcZ_OWZIrD7SBJXIf_BK2ypC4Wq94jE9gCYSS_Gj2Zok9g";
        self.name3 = "ABHINAV SHRIVASTAVA";
        self.designation3 = "Practice head";
        self.comment3 = "You got +1 by Abhinav Shrivastava";

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
                self.designation(self.id());
            }
        });


    }

    return test1ContentViewModel;
});
