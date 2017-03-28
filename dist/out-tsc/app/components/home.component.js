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
        this.graphWrapperState = 'inactive';
        this.summary_state = 'inactive';
        this.graphStates = {
            sleepGraphState: { state: "inactive", order: 1 },
            calorieGraphState: { state: "inactive", order: 2 },
            idleGraphState: { state: "inactive", order: 3 }
        };
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
        // Doughnut
        this.doughnutChartLabels = ['Running', 'Soccer', 'Weight Lifting'];
        this.doughnutChartData = [350, 450, 200];
        this.doughnutChartType = 'doughnut';
        this.doughnutChartColors = [{ backgroundColor: ["#FF6384", "#00d9f9", "#FFFF66"] }];
        this.doughnutChartOptions = {
            responsive: true,
            animation: { animateScale: true },
            maintainAspectRatio: false
        };
        this.todaysDate = this.setTodaysDate();
        this.mood_face = "img/001-sad.svg";
        this.steps_icon = "img/013-running.svg";
        this.HR_icon = "img/012-heart-tile.svg";
        this.heart_icon = "img/012-heart-day.svg";
        this.bed_icon = "img/011-bed.svg";
        this.moon_tile_icon = "img/010-moon-tile.svg";
        this.moon_day_icon = "img/010-moon-day.svg";
        this.sun_icon = "img/006-sun.svg";
        this.flame_icon = "img/005-flame.svg";
        this.football_icon = "img/004-soccer-ball.svg";
        this.dumbbell_icon = "img/002-dumbbell.svg";
        this.bike_icon = "img/003-bicycle.svg";
        this.clock_icon = "img/008-clock.svg";
        this.burn_icon = "img/007-burn.svg";
        this.desk_icon = "img/009-desk.svg";
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
    // expands/collapses the summary tile
    HomeComponent.prototype.toggleMove = function () {
        this.summary_state = (this.summary_state === 'inactive' ? 'active' : 'inactive');
    };
    // function to show/hide the summaryGraph tiles
    HomeComponent.prototype.toggleGraph = function (graphStateName) {
        // determine ordering and wrapper visibility
        if (this.graphStates[graphStateName].state == 'inactive') {
            // re-order tiles
            for (var key in this.graphStates) {
                var attrName = key.toString();
                var graphState = this.graphStates[attrName];
                if (graphState.state == 'active' && attrName != graphStateName) {
                    // if the graph is visible and not the selected one, then increments its order
                    graphState.order++;
                }
            }
            this.graphStates[graphStateName].order = 1; // finally move new tile to top
            // show wrapper if not already visibile
            if (this.noGraphsActive() == 0) {
                this.graphWrapperState = 'active';
            }
        }
        else {
            // re-order tiles
            for (var key in this.graphStates) {
                var attrName = key.toString();
                var graphState = this.graphStates[attrName];
                if (graphState.state == 'active' && attrName != graphStateName) {
                    if (graphState.order > this.graphStates[graphStateName].order) {
                        // if the graph is visible and below the current, decrement its order
                        graphState.order--;
                    }
                }
            }
            // finally move new tile to last order
            this.graphStates[graphStateName].order = 3;
            // hide wrapper if its the last tile
            if (this.noGraphsActive() == 1) {
                this.graphWrapperState = 'inactive';
            }
        }
        // toggle relevant graph state
        this.graphStates[graphStateName].state = (this.graphStates[graphStateName].state === 'inactive' ? 'active' : 'inactive');
    };
    // function returning the no. of graphs visible on the page
    HomeComponent.prototype.noGraphsActive = function () {
        var activeCount = 0;
        for (var key in this.graphStates) {
            var attrName = key.toString();
            var value = this.graphStates[attrName];
            if (value.state == 'active') {
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
                        backgroundColor: 'white',
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