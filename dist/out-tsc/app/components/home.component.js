var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, trigger, state, style, transition, animate } from '@angular/core';
export var HomeComponent = (function () {
    function HomeComponent() {
        this.graphStates = { sleepGraphState: "inactive", calorieGraphState: "inactive", idleGraphState: "inactive" };
        this.graphWrapperState = 'inactive';
        this.summary_state = 'inactive';
        // lineChart
        this.lineChartData = [
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
            { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
        ];
        this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        this.lineChartOptions = {
            responsive: false
        };
        this.lineChartColors = [
            {
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            },
            {
                backgroundColor: 'rgba(77,83,96,0.2)',
                borderColor: 'rgba(77,83,96,1)',
                pointBackgroundColor: 'rgba(77,83,96,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)'
            },
            {
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            }
        ];
        this.lineChartLegend = true;
        this.lineChartType = 'line';
        this.todaysDate = this.setTodaysDate();
    }
    HomeComponent.prototype.setTodaysDate = function () {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var today = new Date();
        var day = days[today.getDay()];
        var month = months[today.getMonth()];
        var wholeDate = "Today,  " + day + " " + today.getDate() + " " + month + " " + today.getFullYear();
        return wholeDate;
    };
    HomeComponent.prototype.toggleMove = function () {
        this.summary_state = (this.summary_state === 'inactive' ? 'active' : 'inactive');
    };
    HomeComponent.prototype.toggleGraph = function (graphID) {
        // show/hide the background tile depending on if there are any graphs visible
        if (this.graphStates[graphID] == 'inactive') {
            // we want to show a tile so show wrapper if not already visibile
            if (this.noGraphsActive() == 0) {
                this.graphWrapperState = 'active';
            }
        }
        else {
            // we want to hide a tile so hide wrapper if its the last tile
            if (this.noGraphsActive() == 1) {
                this.graphWrapperState = 'inactive';
            }
        }
        // toggle relevant graph state
        this.graphStates[graphID] = (this.graphStates[graphID] === 'inactive' ? 'active' : 'inactive');
    };
    HomeComponent.prototype.noGraphsActive = function () {
        var activeCount = 0;
        for (var key in this.graphStates) {
            var attrName = key.toString();
            var value = this.graphStates[attrName];
            if (value == 'active') {
                activeCount++;
            }
        }
        return activeCount;
    };
    HomeComponent.prototype.randomize = function () {
        var _lineChartData = new Array(this.lineChartData.length);
        for (var i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
            for (var j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.lineChartData = _lineChartData;
    };
    // events
    HomeComponent.prototype.chartClicked = function (e) {
        console.log(e);
    };
    HomeComponent.prototype.chartHovered = function (e) {
        console.log(e);
    };
    HomeComponent = __decorate([
        Component({
            selector: 'home',
            templateUrl: 'home.component.html',
            //styleUrls: ['app.component.css']
            animations: [
                trigger('movePanel', [
                    state('inactive', style({
                        height: "0"
                    })),
                    state('active', style({
                        backgroundColor: '#EEEEEE',
                        height: "200px"
                    }))
                ]),
                trigger('toggleGraph', [
                    state('inactive', style({
                        height: 0,
                        minHeight: 0,
                        marginTop: 0
                    })),
                    state('active', style({
                        minHeight: "300px"
                    })),
                    transition('active => inactive', [
                        animate('0.5s', style({
                            height: 0,
                            minHeight: 0
                        }))
                    ]),
                    transition('inactive => active', [
                        animate('0.5s', style({
                            height: "auto",
                            minHeight: "300px",
                            marginTop: "1%"
                        }))
                    ])
                ]),
                trigger('toggleGraphWrapper', [
                    state('inactive', style({
                        height: 0,
                        minHeight: 0,
                        marginTop: 0
                    })),
                    state('active', style({
                        minHeight: "300px"
                    })),
                    transition('active => inactive', [
                        animate('0.5s', style({
                            height: 0,
                            minHeight: 0
                        }))
                    ]),
                    transition('inactive => active', [
                        animate('0.5s', style({
                            height: "auto",
                            minHeight: "300px",
                            marginTop: "1%"
                        }))
                    ])
                ])
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], HomeComponent);
    return HomeComponent;
}());
//# sourceMappingURL=D:/front-app/src/app/components/home.component.js.map