/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * topRanks module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojchart', 'ojs/ojmodel', 'ojs/ojbutton', 'ojs/ojmenu'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function nameFunction(NAME) {
        var initial = NAME.charAt(0) + NAME.charAt(NAME.lastIndexOf(" ") + 1);
        return initial;
    }
    function Rankers1(x1, y1, z1, name1,id) {
        var ranker = new Object();
        ranker.x = x1;
        ranker.y = parseInt(y1);
        ranker.z = z1;
        ranker.Member = name1;
        ranker.label = nameFunction(name1);
        ranker.userId = id;
        return ranker;
    }

    function teamMember(data) {
        var member = this;
        member.name = data['google_name'];
        member.userId = data['id'];
        member.pic = data['google_picture_link'] == "" ? 'images/warning-icon-24.png' : data['google_picture_link'];
        member.designation = data['designation'];
        member.role_name = data['role_name'];
        member.google_id = data['google_id'];

        return member;
    }

    function topRanksContentViewModel(person) {
        var self = this;
        
  self.selectedMenuItem = ko.observable("(None selected yet)");

    self.menuItemSelect = function( event, ui ) {
        console.log(event['currentTarget']);
       
    };

        self.members = ko.observableArray([]);
        self.userId = ko.observable();
        this.myRank = ko.observable();
        this.totalMembers = ko.observable();
        self.loginUserId = ko.observable();
        self.name = ko.observable();
        self.noRank = ko.observable();
        var user = oj.Model.extend({
            url: getUserByEmail + person['email']
        });
        var getDetails = new user();
        getDetails.fetch({
            headers: {secret: secret},
            success: function (result) {
                self.loginUserId(result['attributes']['data']['id']);
                var getRank = oj.Model.extend(
                        {
                            url: getMyRank + self.loginUserId(),
                        });
                var memberRank = new getRank();
                memberRank.fetch({
                    headers: {secret: secret},
                    success: function () {
                        self.myRank(memberRank['attributes']['data']['my_rank']);
                        if(self.myRank() == "-"){
                            self.noRank("You have not yet received +1 rating.");
                        }
                        else{
                            self.noRank("");
                        }
                        self.totalMembers(memberRank['attributes']['data']['total_user_count']);
                    }
                });
            }
        });


        self.data12 = ko.observableArray([]);
        self.bubbleSeriesValue = ko.observableArray();
        self.bubbleSeries = ko.observableArray([
            {name: "Series 1", displayInLegend: 'off', items: []},
            {name: "Series 2", displayInLegend: 'off', items: []},
            {name: "Series 3", displayInLegend: 'off', items: []},
            {name: "Series 4", displayInLegend: 'off', items: []},
            {name: "Series 5", displayInLegend: 'off', items: []},
            {name: "Series 6", displayInLegend: 'off', items: []},
            {name: "Series 7", displayInLegend: 'off', items: []},
            {name: "Series 8", displayInLegend: 'off', items: []},
            {name: "Series 9", displayInLegend: 'off', items: []},
            {name: "Series 10", displayInLegend: 'off', items: []}
        ]);
        var rate = oj.Model.extend({
            url: getRankingList
                    //parse: parseTask
        });
        var rateTask = new rate();
        rateTask.fetch({
            headers: {secret: secret},
            success: function (res) {
                var data1 = res['attributes']['data'];
                for (var counter = 0; counter < data1.length; counter++) {
                    self.data12.push(Rankers1((counter+1), data1[counter]['pluscount'], (90 - (counter * 5)), data1[counter]['google_name'],data1[counter]['user_id']));
                }
                for (var i = 0; i < self.data12().length; i++) {
                    self.bubbleSeries()[i].items.push({
                        x: self.data12()[i].x, y: self.data12()[i].y, z: self.data12()[i].z, label: self.data12()[i].label, labelPosition: 'auto',
                        shortDesc: "&lt;b&gt;" + self.data12()[i].Member + "&lt;/b&gt;" + "&lt;br/&gt;Total +1 ratings: " + self.data12()[i].y + "&lt;br/&gt;",
                        user_id:self.data12()[i].userId
                    });
                }
                self.bubbleSeriesValue(self.bubbleSeries());
            }
        });
        
        
        self.chartOptionChange =  function(event, ui) {  
          if (ui['option'] == 'selection') {
              var userId = ui['optionMetadata']['selectionData'][0]['data']['user_id'];
              window.location = "memberProfile.html?id=" + userId;
          }
        }
        
        
        var bubbleGroups = ["MEMBER"];
        this.bubbleGroupsValue = ko.observableArray(bubbleGroups);
        /* chart axes */
        self.xTitle1 = ko.observable('Rank');
        self.xStyle1 = ko.observable('color:#fff;');
        self.xMajorTickWidth1 = ko.observable(1);
        self.xMajorTickStyle1 = ko.observableArray(['solid']);
        self.xAxisLineColor1 = ko.observable('#689F39');
        self.xAxisLineWidth1 = ko.observable(1);
        self.yTitle1 = ko.observable('Total +1 ratings');
        self.yStyle1 = ko.observable('color:#fff;');
        self.yAxisLineColor1 = ko.observable('#689F39');
        self.yAxisLineWidth1 = ko.observable(1);
        self.yMajorTickWidth1 = ko.observable(1);
        self.yMajorTickStyle1 = ko.observableArray(['solid']);
        self.yTickLabelPosition1 = ko.observableArray(['outside']);
        self.xAxis1 = ko.pureComputed(function () {
            return {
                title: self.xTitle1(),
                titleStyle: self.xStyle1(),
                axisLine: {
                    lineColor: self.xAxisLineColor1(),
                    lineWidth: self.xAxisLineWidth1()
                },
                majorTick: {
                    lineWidth: self.xMajorTickWidth1(),
                    lineStyle: self.xMajorTickStyle1()[0]
                },
                tickLabel: {
                    style : 'color:#fff'
                }
            };
        });
        self.yAxis1 = ko.pureComputed(function () {
            return {
                title: self.yTitle1(),
                titleStyle: self.yStyle1(),
                axisLine: {
                    lineColor: self.yAxisLineColor1(),
                    lineWidth: self.yAxisLineWidth1()
                },
                majorTick: {
                    lineWidth: self.yMajorTickWidth1(),
                    lineStyle: self.yMajorTickStyle1()[0]
                },
                tickLabel: {
                    position: self.yTickLabelPosition1()[0],
                    style : 'color:#fff'
                }
            };
        });

    }


    return topRanksContentViewModel;
});
