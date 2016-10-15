/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * members module
 */
define(['ojs/ojcore', 'knockout','ojs/ojmodel', 'ojs/ojtable', 'ojs/ojcollectiontabledatasource'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function membersContentViewModel() {
        var self = this;
        
        
   //     http://api.parakh.com/v1/index.php/getUserByLead/<lead_id>
        
        var TaskRecord = oj.Model.extend({
                        url: "http://dev.parakh.com/services",
                        //parse: parseTask
                        });
        var task = new TaskRecord();
        task.fetch({
          success: function(res) {
              
//              var selectedIdsArray = [];
//                $("input:checkbox").each(function() {
//        var $this = $(this);
//                if ($this.is(":checked")) {
//        selectedIdsArray.push($this.attr("id"));
//        }
              //name, id, role_id, g_id, designation, email
              console.log(
                task.attributes['data']['google_name']+" "+
                task.attributes['data']['role_id']+" "+
                task.attributes['data']['google_id']+" "+
                task.attributes['data']['designation']+" "+ 
                task.attributes['data']['google_email']);
            self.FFF.push(new data(
                task.attributes['data']['google_name'],
                task.attributes['data']['role_id'],
                task.attributes['data']['google_id'],
                task.attributes['data']['designation'],
                task.attributes['data']['google_email']));
            console.log(task.attributes);
          }
        });
        
        
        
        
    }

    return membersContentViewModel;
});
///////////////////////////////////////////////////study this part/////////////////////////

//        //self.serviceURL = 'https://data-api-lucasjellema.apaas.em2.oraclecloud.com/departments';
//        self.serviceURL = 'http://dev.parakh.com/services/';
//        self.DeptCol = ko.observable(); // DeptCol is an observable so when its data is in (from the REST service), the datasource is triggered
//        self.datasource = ko.observable(); // datasource is an observable so when it is triggered/refreshed, the table component is triggered
//        
//        function parseRESTDBDepartment(response) {
//            alert("1"+response);
//            return {DepartmentId: response['DEPARTMENT_ID'], DepartmentName: response['DEPARTMENT_NAME'], Location: "Zoetermeer"};
//        }
//
//// think of this as a single record in the DB, or a single row in your table
//        var Department = oj.Model.extend({
//            parse: parseRESTDBDepartment,
//            idAttribute: 'DepartmentId'
//        });
//
//// this defines our collection and what models it will hold
//        var DeptCollection = oj.Collection.extend({
//            url: self.serviceURL,
//            model: new Department(),
//            comparator: "DepartmentId",
//            header:{secret:'parakh-revamp-local-key-2016'}
//        });
//
//        self.DeptCol(new DeptCollection());
//        self.datasource(new oj.CollectionTableDataSource(self.DeptCol()));
