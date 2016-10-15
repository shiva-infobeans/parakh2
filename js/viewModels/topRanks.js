/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * topRanks module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojchart'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function nameFunction(NAME) {
        var initial = NAME.charAt(0) + NAME.charAt(NAME.lastIndexOf(" ") + 1);
        return initial;
    }
    function topRanksContentViewModel() {
        var self = this;
        //console.log(nameFunction("SHIVA SHIRBHATE"));
        var data = [
            {x: 10, y: 40, z: 90, Member: "Mahender Devangan", label: nameFunction("Mahender Devangan"), labelPosition: 'auto'},
            {x: 9, y: 35, z: 85, Member: "SHIVA SHIRBHATE", label: nameFunction("SHIVA SHIRBHATE"), labelPosition: 'auto'},
            {x: 8, y: 32, z: 80, Member: "SHIVA SHIRBHATE", label: "3rd MEMBER", labelPosition: 'auto'},
            {x: 7, y: 30, z: 75, Member: "SHIVA SHIRBHATE", label: "Group d", labelPosition: 'auto'},
            {x: 6, y: 12, z: 70, Member: "SHIVA SHIRBHATE", label: "Group e", labelPosition: 'auto'},
            {x: 5, y: 11, z: 65, Member: "SHIVA SHIRBHATE", label: "Group f", labelPosition: 'auto'},
            {x: 4, y: 10, z: 60, Member: "SHIVA SHIRBHATE", label: "Group A", labelPosition: 'auto'},
            {x: 3, y: 9, z: 55, Member: "SHIVA SHIRBHATE", label: "Group h", labelPosition: 'auto'},
            {x: 2, y: 8, z: 50, Member: "SHIVA SHIRBHATE", label: "Group i", labelPosition: 'auto'},
            {x: 1, y: 7, z: 45, Member: "SHIVA SHIRBHATE", label: "Group k", labelPosition: 'auto'}
        ];
        /* basic chart data */
        self.bubbleSeries = [
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
        ];
        for (var i = 0; i < data.length; i++) {
            self.bubbleSeries[i].items.push({
                x: data[i].x, y: data[i].y, z: data[i].z, label: data[i].label, labelPosition: 'auto',
                shortDesc: "&lt;b&gt;"+data[i].Member + "&lt;/b&gt;"+"&lt;br/&gt;Total +1 ratings: " + data[i].y + "&lt;br/&gt;"
            });
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
                    position: self.yTickLabelPosition1()[0]
                }
            };
        });
        this.bubbleSeriesValue = ko.observableArray(self.bubbleSeries);
    }


    return topRanksContentViewModel;
});
