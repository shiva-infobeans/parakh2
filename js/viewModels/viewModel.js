/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * viewModel module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodel', 'ojs/ojcollectiontreedatasource'
            , 'ojs/ojcollectiondatagriddatasource'
            , 'ojs/ojcollectionpagingdatasource',
    , 'ojs/ojcollectiontabledatasource'

], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function data(name, id, role_id, g_id, designation, email) {
        var member = this;
        member.name = name;
        member.teamId = id;
        member.role_id = role_id;
        member.google_id = g_id;
        member.designation = designation;
        member.google_email = email;
        return member;
    }
    
    function viewModelContentViewModel(person) { //here there is person who is logged in
        
        var self = this;
        this.FFF = ko.observableArray([]);
        
        self.email =  "abhijeet.dange@infobeans.com";
        var TaskRecord = oj.Model.extend({
                        url: "http://dev.parakh.com/parakh-new/v1/index.php/getUserByEmail/"+self.email,
                        //parse: parseTask
                        });
        var task = new TaskRecord();
        task.fetch({
             headers:{secret:'parakh-revamp-local-key-2016'},
          success: function() {
              
            self.FFF.push(new data(
                task.attributes['data']['google_name'],
                task.attributes['data']['role_id'],
                task.attributes['data']['google_id'],
                task.attributes['data']['designation'],
                task.attributes['data']['google_email']));
            
          }
        });
       
       self.people = ko.observableArray([
        { name: 'Bert' },
        { name: 'Charles' },
        { name: 'Denise' }
    ]);
 
    self.addPerson = function() {
        self.people.push({ name: "New at " + new Date() });
    };
 
    self.removePerson = function() {
        self.people.remove(this);
    }
       
    }
    return viewModelContentViewModel;
});
