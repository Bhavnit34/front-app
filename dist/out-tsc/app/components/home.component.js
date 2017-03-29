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
import { PostsService } from '../services/posts.service';
export var HomeComponent = (function () {
    function HomeComponent(postsService) {
        this.postsService = postsService;
        this.icons = {
            mood_1: "img/mood-1.svg",
            mood_2: "img/mood-2.svg",
            mood_3: "img/mood-3.svg",
            mood_4: "img/mood-4.svg",
            mood_5: "img/mood-5.svg",
            steps: "img/running.svg",
            heart_tile: "img/heart-tile.svg",
            heart_day: "img/heart-day.svg",
            bed: "img/bed.svg",
            moon_tile: "img/moon-tile.svg",
            moon_day: "img/moon-day.svg",
            sun: "img/sun.svg",
            flame: "img/flame.svg",
            soccer: "img/soccer.svg",
            dumbbell: "img/dumbbell.svg",
            bike: "img/bicycle.svg",
            clock: "img/clock.svg",
            burn: "img/burn.svg",
            desk: "img/desk.svg",
            mood: "img/sleeping.svg",
            tennis: "img/tennis.svg",
        };
        this.attributes = {
            awake_time: "loading...",
            asleep_time: "loading...",
            HR: "loading...",
            calories: "loading...",
            idle_time: "loading...",
            steps: "loading...",
            steps_avg: "loading...",
            steps_max: "loading...",
            active_time: "loading...",
            active_time_avg: "loading...",
            active_time_max: "loading...",
            mood: this.icons.mood
        };
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
            responsive: true,
            maintainAspectRatio: false
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
        this.getTodaysAttributes(postsService);
    }
    // function to obtain the info needed to populate the todayTile
    HomeComponent.prototype.getTodaysAttributes = function (postsService) {
        var _this = this;
        // todays sleep
        postsService.getTodaysSleep().subscribe(function (posts) {
            _this.todaysSleep = posts;
            var asleep_ts = _this.todaysSleep.Items[0].info.details.asleep_time;
            _this.attributes.asleep_time = new Date(asleep_ts * 1000).toTimeString().substr(0, 5);
            var awake_ts = _this.todaysSleep.Items[0].info.details.awake_time;
            _this.attributes.awake_time = new Date(awake_ts * 1000).toTimeString().substr(0, 5);
        });
        // todays moves
        postsService.getTodaysMoves().subscribe(function (posts) {
            _this.todaysMoves = posts;
            // calories
            _this.attributes.calories = Math.round(_this.todaysMoves.Items[0].info.details.calories).toString();
            // idle time
            var it = new Date(null);
            it.setSeconds(_this.todaysMoves.Items[0].info.details.longest_idle);
            _this.attributes.idle_time = (it.toISOString().substr(11, 2) + "h " + it.toISOString().substr(14, 2) + "m");
            // steps
            _this.attributes.steps = _this.todaysMoves.Items[0].info.details.steps;
            // active time
            var at = new Date(null);
            at.setSeconds(_this.todaysMoves.Items[0].info.details.active_time);
            _this.attributes.active_time = (at.toISOString().substr(11, 2) + "h " + at.toISOString().substr(14, 2) + "m");
        });
        // todays heartrate
        postsService.getTodaysHR().subscribe(function (posts) {
            _this.todaysHR = posts;
            _this.attributes.HR = _this.todaysHR.Items[0].heartrate;
        });
        // todays mood
        postsService.getTodaysMood().subscribe(function (posts) {
            _this.todaysMood = posts;
            if (_this.todaysMood.Count !== 0) {
                var mood = _this.todaysMood.Items[0].mood;
                _this.attributes.mood = _this.icons["mood_" + mood];
            }
        });
        // stats
    };
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
    // events
    HomeComponent.prototype.chartClicked = function (e) {
        // console.log(e);
    };
    HomeComponent.prototype.chartHovered = function (e) {
        // console.log(e);
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
            ],
            providers: [PostsService]
        }), 
        __metadata('design:paramtypes', [PostsService])
    ], HomeComponent);
    return HomeComponent;
}());
//# sourceMappingURL=D:/front-app/src/app/components/home.component.js.map