import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';
import {PostsService} from '../services/posts.service';
import {Observable} from "rxjs";
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';

@Component({
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
})
export class HomeComponent {
  public month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
  public  day_names = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  public icons = {
    mood_1: "assets/img/mood-1.svg",
    mood_2: "assets/img/mood-2.svg",
    mood_3: "assets/img/mood-3.svg",
    mood_4: "assets/img/mood-4.svg",
    mood_5: "assets/img/mood-5.svg",
    steps:"assets/img/running.svg",
    heart_tile : "assets/img/heart-tile.svg",
    heart_day : "assets/img/heart-day.svg",
    bed : "assets/img/bed.svg",
    moon_tile : "assets/img/moon-tile.svg",
    moon_day : "assets/img/moon-day.svg",
    sun : "assets/img/sun.svg",
    flame :"assets/img/flame.svg",
    soccer : "assets/img/soccer.svg",
    dumbbell : "assets/img/dumbbell.svg",
    bike : "assets/img/bicycle.svg",
    clock : "assets/img/clock.svg",
    burn_tile : "assets/img/burn_tile.svg",
    burn_day : "assets/img/burn_day.svg",
    desk : "assets/img/desk.svg",
    mood : "assets/img/sleeping.svg",
    tennis : "assets/img/tennis.svg",
    running: "assets/img/running.svg"
  };
  // data loaded from REST API
  todaysSleep: APIResult; todaysMoves: APIResult; todaysHR: APIResult; todaysMood: APIResult; stats: APIResult;
  attributes: Attributes = {
    awake_time: "",
    asleep_time: "",
    HR: "",
    calories: "",
    idle_time: "",
    steps: "",
    steps_avg: "",
    steps_max: "",
    active_time: "",
    active_time_value: 0,
    active_time_avg: "",
    active_time_max: "",
    mood: this.icons.mood
  };
  barWidth: BarWidth = {steps: "75%", steps_avg: "60%", active_time: "80%", active_time_avg: "65%"};

  // Day tile
  last3Sleep: APIResult; last3Moves: APIResult; last3HR: APIResult; last3Mood: APIResult;
  private dayTiles: Array<DayTile> = new Array<DayTile>();
  todaysDate: string;



  // Graphs
  graphWrapperState: string = 'inactive';
  summary_state: string = 'inactive';
  graphStates: GraphStates = {
    sleepGraphState: {state: "inactive", order: 1},
    calorieGraphState: {state: "inactive", order: 2},
    idleGraphState: {state: "inactive", order: 3}
  };
  sleepGraphSeries: Array<GraphSeries> = [];
  sleepGraphLabels: Array<any> = [];
  calorieGraphSeries: Array<GraphSeries> = [];
  calorieGraphLabels: Array<any> = [];
  activeTimeGraphSeries: Array<GraphSeries> = [];
  activeTimeGraphLabels: Array<any> = [];

  constructor(private postsService: PostsService) {
    this.todaysDate = this.setTodaysDate();
    this.getTodaysAttributes(postsService).subscribe((data) => {
      // run these function once the previous has been completed
      this.getLast3Attributes(postsService);


      this.populateCalorieActiveTimeGraph().subscribe((data) => {
        this.calorieChartData = this.calorieGraphSeries;
        this.activeTimeChartData = this.activeTimeGraphSeries;
        setTimeout(() => { // a fix as the package is bugged to dynamically change labels
          this.calorieChartLabels = this.calorieGraphLabels;
          this.activeTimeChartLabels = this.activeTimeGraphLabels;
        });
      });
    });


    this.getLastWeeksSleep(postsService).subscribe((data) => {
      this.barChartData = this.sleepGraphSeries;

      setTimeout(() => { // a fix as the package is bugged to dynamically change labels
        this.barChartLabels = this.sleepGraphLabels;
        });
    });

  }


  // function to obtain the info needed to populate the todayTile
  public getTodaysAttributes(postsService) : Observable<any> {
    return Observable.create(observer => {
      // todays sleep
      postsService.getTodaysAttr("sleeps").subscribe(posts => {
        this.todaysSleep = posts;
        let asleep_ts = this.todaysSleep.Items[0].info.details.asleep_time;
        this.attributes.asleep_time = new Date(asleep_ts * 1000).toTimeString().substr(0, 5);
        let awake_ts = this.todaysSleep.Items[0].info.details.awake_time;
        this.attributes.awake_time = new Date(awake_ts * 1000).toTimeString().substr(0, 5);


        // todays moves
        postsService.getTodaysAttr("moves").subscribe(posts => {
          this.todaysMoves = posts;
          // calories
          this.attributes.calories = Math.round(this.todaysMoves.Items[0].info.details.calories).toString() + " calories";
          // idle time
          let it = new Date(null);
          it.setSeconds(this.todaysMoves.Items[0].info.details.longest_idle);
          this.attributes.idle_time = (it.toISOString().substr(11, 2) + "h " + it.toISOString().substr(14, 2) + "m");

          // steps
          this.attributes.steps = this.todaysMoves.Items[0].info.details.steps;
          // active time
          let at = new Date(null);
          at.setSeconds(this.todaysMoves.Items[0].info.details.active_time);
          this.attributes.active_time = (at.toISOString().substr(11, 2) + "h " + at.toISOString().substr(14, 2) + "m");
          this.attributes.active_time_value = this.todaysMoves.Items[0].info.details.active_time;

          // todays heartrate
          postsService.getTodaysAttr("heartrate").subscribe(posts => {
            this.todaysHR = posts;
            if (this.todaysHR.Items[0].heartrate > 0)
              this.attributes.HR = this.todaysHR.Items[0].heartrate + " bpm";



            // todays mood
            postsService.getTodaysAttr("mood").subscribe(posts => {
              this.todaysMood = posts;
              if (this.todaysMood.Count !== 0) {
                let mood = this.todaysMood.Items[0].mood;
                this.attributes.mood = this.icons["mood_" + mood];
              }
              // stats
              postsService.getTodaysStats().subscribe(posts => {
                this.stats = posts;
                // round some values
                this.stats.Items[0].info.Moves.Distance.max = this.stats.Items[0].info.Moves.Distance.max.toFixed(2) + "m";


                if (this.stats.Count !== 0) {
                  let avg = 0;
                  let max = 0;
                  let current = 0;
                  let perc = 0; // width of the bar, to be assigned below

                  // steps
                  avg = this.stats.Items[0].info.Moves.Steps.avg;
                  max = this.stats.Items[0].info.Moves.Steps.max;
                  this.attributes.steps_avg = avg.toString();
                  this.attributes.steps_max = max.toString();
                  current = parseInt(this.attributes.steps);
                  // work out length of the steps bars
                  perc = Math.round((avg / max) * 100);
                  this.barWidth.steps_avg = perc + "%";
                  perc = Math.round((current / max) * 100);
                  this.barWidth.steps = perc + "%";

                  // active time
                  let t = new Date(null);
                  avg = this.stats.Items[0].info.Moves.Active_time.avg;
                  t.setSeconds(avg);
                  this.attributes.active_time_avg = (t.toISOString().substr(11, 2) + "h " + t.toISOString().substr(14, 2) + "m");

                  t = new Date(null);
                  max = this.stats.Items[0].info.Moves.Active_time.max;
                  t.setSeconds(max);
                  this.attributes.active_time_max = (t.toISOString().substr(11, 2) + "h " + t.toISOString().substr(14, 2) + "m");

                  current = this.attributes.active_time_value;

                  // work out length of active_time_avg bar
                  perc = Math.round((avg / max) * 100);
                  this.barWidth.active_time_avg = perc + "%";
                  perc = Math.round((current / max) * 100);
                  this.barWidth.active_time = perc + "%";
                  observer.next();
                  observer.complete();
                }
              }); // postsService Stats
            }); // postsService mood
          }); // postsService HR
        }); // postsService moves
      }); // postsService sleeps
    });

  }


  // function to obtain the info for the past 3 days to populate the day cards
  public getLast3Attributes(postsService) {
    // create a new dayTile object for each day
      let dayTile = new DayTile();

      // set date
      let d = new Date();
      d.setDate(d.getDate() - 3);
      d.setHours(0, 0, 0, 0);
      dayTile.date = this.day_names[d.getDay()] + " " + d.getDate() + " " + this.month_names[d.getMonth()];
      dayTile.year = d.getFullYear();
      dayTile.timestamp = d.getTime();

      this.getAttributeForDate(postsService, d, dayTile).subscribe( (tile1) => {
        this.dayTiles.push(tile1); // push to array of tiles

        dayTile = new DayTile();
        d = new Date();
        d.setDate(d.getDate() - 2);
        dayTile.date = this.day_names[d.getDay()] + " " + d.getDate() + " " + this.month_names[d.getMonth()];
        dayTile.year = d.getFullYear();
        dayTile.timestamp = d.getTime();

        this.getAttributeForDate(postsService, d, dayTile).subscribe( (tile2) => {
          this.dayTiles.push(tile2); // push to array of tiles

          dayTile = new DayTile();
          d = new Date();
          d.setDate(d.getDate() - 1);
          dayTile.date = this.day_names[d.getDay()] + " " + d.getDate() + " " + this.month_names[d.getMonth()];
          dayTile.year = d.getFullYear();
          dayTile.timestamp = d.getTime();

          this.getAttributeForDate(postsService, d, dayTile).subscribe( (tile3) => {
            this.dayTiles.push(tile3); // push to array of tiles
          });
        });
      });



  } // end function



  public getAttributeForDate(postsService, d, dayTile) : Observable<any> {
    return Observable.create(observer => {

      // set sleeps
      postsService.getAttrForDay("sleeps", d.getTime(), 1).subscribe(posts => {
        this.last3Sleep = posts;
        if (this.last3Sleep.Items[0].Count !== 0) {
          // set sleep info
          let asleep_ts = this.last3Sleep.Items[0].info.details.asleep_time;
          dayTile.asleep_time = new Date(asleep_ts * 1000).toTimeString().substr(0, 5);
          let awake_ts = this.last3Sleep.Items[0].info.details.awake_time;
          dayTile.awake_time = new Date(awake_ts * 1000).toTimeString().substr(0, 5);
          let sd = new Date(null);
          sd.setSeconds(this.last3Sleep.Items[0].info.details.duration);
          dayTile.sleep_duration = (sd.toISOString().substr(11, 2) + "h " + sd.toISOString().substr(14, 2) + "m");

          // sleep duration max
          sd = new Date(null);
          sd.setSeconds(this.stats.Items[0].info.Sleep.Duration.max);
          dayTile.sleep_duration_max = (sd.toISOString().substr(11, 2) + "h " + sd.toISOString().substr(14, 2) + "m");
          // sleep duration avg
          sd = new Date(null);
          sd.setSeconds(this.stats.Items[0].info.Sleep.Duration.avg);
          dayTile.sleep_duration_avg = (sd.toISOString().substr(11, 2) + "h " + sd.toISOString().substr(14, 2) + "m");


          // set bar widths
          let max = this.stats.Items[0].info.Sleep.Duration.max;
          let avg = this.stats.Items[0].info.Sleep.Duration.avg;
          let perc = Math.round(avg / max * 100);
          dayTile.sleep_duration_avg_width = perc + "%"; // sleep duration avg
          perc = Math.round(parseInt(this.last3Sleep.Items[0].info.details.duration) / max * 100);
          dayTile.sleep_duration_width = perc + "%"; // sleep duration current

        }

        // moves
        postsService.getAttrForDay("moves", d.getTime(), 1).subscribe(posts => {
          this.last3Moves = posts;
          if (this.last3Moves.Items[0].Count !== 0) {
            // set moves (steps, active time, calories, distance)
            dayTile.steps = this.last3Moves.Items[0].info.details.steps;
            dayTile.distance = this.last3Moves.Items[0].info.details.distance.toFixed(2) + "m";
            dayTile.calories = Math.round(this.last3Moves.Items[0].info.details.calories).toString();
            let at = new Date(null);
            at.setSeconds(this.last3Moves.Items[0].info.details.active_time);
            dayTile.active_time = (at.toISOString().substr(11, 2) + "h " + at.toISOString().substr(14, 2) + "m");

            // set bar widths
            let max = this.stats.Items[0].info.Moves.Distance.max;
            let avg = this.stats.Items[0].info.Moves.Distance.avg;
            let perc = Math.round(avg / max * 100);
            dayTile.distance_avg_width = perc + "%"; // distance avg
            perc = Math.round(parseInt(dayTile.distance) / max * 100);
            dayTile.distance_width = perc + "%"; // distance current

          }

          // HR
          postsService.getAttrForDay("heartrate", d.getTime(), 1).subscribe(posts => {
            this.last3HR = posts;
            if (this.last3HR.Count !== 0) {
              // set HR
              dayTile.HR = this.last3HR.Items[0].heartrate;
            }

            // mood
            postsService.getAttrForDay("mood", d.getTime(), 1).subscribe(posts => {
              this.last3Mood = posts;
              // set mood
              if (this.last3Mood.Count !== 0) {
                let mood_date = new Date(this.last3Mood.Items[0].timestamp_completed * 1000);
                mood_date.setHours(0, 0, 0, 0);
                let mood = this.last3Mood.Items[0].mood;
                dayTile.mood = this.icons["mood_" + mood];
              }

              // workouts
              postsService.getAttrForDay("workouts", d.getTime(), 10).subscribe(posts => {
                // loop through all workouts in a day and add to the tile
                for (let i = 0; i < posts.Count; i++) {
                  let wo = new DayTileWorkout();
                  let wt = new Date(null);
                  wt.setSeconds(posts.Items[i].info.details.time);
                  wo.duration = (wt.toISOString().substr(11, 2) + "h " + wt.toISOString().substr(14, 2) + "m");
                  wo.icon = this.getIconFromSubType(posts.Items[i].info.sub_type);


                  dayTile.workouts.push(wo);
                }
                observer.next(dayTile);
                observer.complete();

              }); // end postservice Workout
            }); // end postservice Mood
          }); //end postservice HR
        }); // end postservice moves
      }); // end postservice sleeps
    }); // end Observable
  }


  public getLastWeeksSleep(postsService) : Observable<any> {
    return Observable.create(observer => {
      postsService.getAttrForLatestWeek("sleeps").subscribe(posts => {
        let data_duration = {label: "Duration", data: []};
        let data_deep = {label: "Deep Sleep", data: []};
        let data_rem = {label: "REM Sleep", data: []};

        if (posts.Count == 0) {
          console.log("No sleep data returned");
          return;
        } // no sleep data was returned

        for (let i = 0; i < posts.Count; i++) {
          let d = new Date(posts.Items[i].date);
          this.sleepGraphLabels.push(this.day_names[d.getDay()]);
          data_duration.data.push(Math.round(posts.Items[i].info.details.duration / 60));
          data_deep.data.push(Math.round(posts.Items[i].info.details.sound / 60));
          data_rem.data.push(Math.round(posts.Items[i].info.details.rem / 60));
        }

        this.sleepGraphSeries.push(data_duration);
        this.sleepGraphSeries.push(data_deep);
        this.sleepGraphSeries.push(data_rem);


        observer.next();
        observer.complete();
      });
    });
  }

  public populateCalorieActiveTimeGraph(): Observable<any> {
    return Observable.create(observer => {
      let data_calories = {label: "Calories", data: []};
      let data_steps = {label: "Steps", data: []};
      let data_distance = {label: "Distance", data: []};
      let data_active_time = {label: "Active Time", data: []};

      if (this.todaysMoves.Count == 0) {
        console.log("No moves data returned");
        return;
      } // no moves data was returned

      // loop through each hour and add to our local object
      let hour = this.todaysMoves.Items[0].info.details.hourly_totals;
      for (let key in hour) {
        this.calorieGraphLabels.push(key.substr(8,2) + ":00");
        this.activeTimeGraphLabels.push(key.substr(8,2) + ":00");

        if (hour.hasOwnProperty(key)) {
          data_calories.data.push(Math.round(hour[key].calories));
          data_steps.data.push(hour[key].steps);
          data_distance.data.push(Math.round(hour[key].distance));
          data_active_time.data.push(hour[key].active_time);
        }
      }

      // push objects to calorieGraphSeries and activeTimeGraphSeries
      this.calorieGraphSeries.push(data_calories);
      this.calorieGraphSeries.push(data_steps);
      this.activeTimeGraphSeries.push(data_active_time);
      this.activeTimeGraphSeries.push(data_distance);


      observer.next();
      observer.complete();
      });
  }


  public setTodaysDate():string {
    const days:Array<string> = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months:Array<string> = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = new Date();
    const day = days[today.getDay()];
    const month = months[today.getMonth()];
    const wholeDate = "Today,  " + day + " " + today.getDate() + " " + month + " " + today.getFullYear();
    return wholeDate;
  }

  // expands/collapses the summary tile
  toggleMove() {
    this.summary_state = (this.summary_state === 'inactive' ? 'active' : 'inactive');
  }

  // function to show/hide the summaryGraph tiles
  toggleGraph(graphStateName) {
    // determine ordering and wrapper visibility
    if (this.graphStates[graphStateName].state == 'inactive') { // we want to show a tile
      // re-order tiles
      for (var key in this.graphStates) {
        var attrName = key.toString();
        var graphState = this.graphStates[attrName];
        if (graphState.state == 'active' && attrName != graphStateName ){
          // if the graph is visible and not the selected one, then increments its order
          graphState.order++;
        }
      }
      this.graphStates[graphStateName].order = 1; // finally move new tile to top

      // show wrapper if not already visibile
      if(this.noGraphsActive() == 0) {
          this.graphWrapperState = 'active';
      }
    } else { // we want to hide a tile
      // re-order tiles
      for (var key in this.graphStates) {
        var attrName = key.toString();
        var graphState = this.graphStates[attrName];

        if (graphState.state == 'active' && attrName != graphStateName ){
          if(graphState.order > this.graphStates[graphStateName].order) {
            // if the graph is visible and below the current, decrement its order
            graphState.order--;
          }
        }
      }
      // finally move new tile to last order
      this.graphStates[graphStateName].order = 3;


      // hide wrapper if its the last tile
      if(this.noGraphsActive() == 1) {
        this.graphWrapperState = 'inactive';
      }
    }


     // toggle relevant graph state
    this.graphStates[graphStateName].state = (this.graphStates[graphStateName].state === 'inactive' ? 'active' : 'inactive');
  }

  // function returning the no. of graphs visible on the page
  private noGraphsActive():number {
    var activeCount = 0;
    for (var key in this.graphStates) {
      var attrName = key.toString();
      var value = this.graphStates[attrName];
      if (value.state == 'active') {
        activeCount++;
      }
    }
    return activeCount;
  }




  // BAR CHART
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Duration'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Deep Sleep'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'REM Sleep'}
  ];
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'minutes'
        }
      }]
    }
  };
  public barChartLabels:Array<any> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public barChartColors:Array<any> = [
    { // sleep duration
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // deep sleep
      backgroundColor: '#1919FF',
      borderColor: '#1919FF',
      pointBackgroundColor: 'white',
      pointHoverBackgroundColor: '#FFF',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // rem sleep
      backgroundColor: '#7ec0ee',
      borderColor: '#7ec0ee',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#FFF',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];




  // LINE CHART
  public lineChartType:string = 'line';
  public lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'calories / steps'
        }
      }]
    }
  };
  public lineChartLegend:boolean = true;
  public calorieChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Calories'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Steps'}
  ];

  // Calorie / Steps Graph
  public calorieChartLabels:Array<any> = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  public calorieChartColors:Array<any> = [
    { // calories
      backgroundColor: '#F4CC70',
      borderColor: '#F4CC70',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // steps
      backgroundColor: '#5BC8AC',
      borderColor: '#5BC8AC',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#FFF',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  // Active Time / Distance Graph
  public activeTimeChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Distance'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Active Time'}
  ];
  public activeTimeChartLabels:Array<any> = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  public activeTimeChartColors:Array<any> = [
    { // Distance
      backgroundColor: '#e9413e',
      borderColor: '#e9413e',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // Active Time
      backgroundColor: '#3ee6e9',
      borderColor: '#3ee6e9',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#FFF',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];




  // events
  public chartClicked(e:any):void {
    // console.log(e);
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }

  // Doughnut
  public doughnutChartLabels:string[] = ['Running', 'Soccer', 'Weight Lifting'];
  public doughnutChartData:number[] = [350, 450, 200];
  public doughnutChartType:string = 'doughnut';
  doughnutChartColors: any[] = [{ backgroundColor: ["#FF6384", "#00d9f9", "#FFFF66"] }];
  public doughnutChartOptions:any = {
    responsive: true,
    animation:{animateScale: true},
    maintainAspectRatio: false
  };

  public pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }


  public getIconFromSubType(subtype) {
    switch(subtype) {
      case 1: {
        return this.icons.running;
      }
      case 3: {
        return this.icons.dumbbell;
      }
      case 21: {
        return this.icons.soccer;
      }
    }
  }

}

// interface of states and visibility order for each summaryGraph tile
export interface GraphStates {
  sleepGraphState: {state: string; order: number;};
  calorieGraphState: {state: string; order: number;};
  idleGraphState: {state: string; order: number;};
}

export interface Attributes {
  asleep_time: string;
  awake_time: string;
  HR: string;
  calories: string;
  idle_time: string;
  mood: string;
  steps: string;
  steps_avg: string;
  steps_max: string;
  active_time: string;
  active_time_avg: string;
  active_time_max: string;
  active_time_value: number;
}

export interface APIResult {
  Items:Array<any>;
  Count: number;

}

export interface BarWidth {
  steps: string;
  steps_avg: string;
  active_time: string;
  active_time_avg: string;
}

export class GraphSeries {
  data: Array<number>;
  label: string;

  constructor() {
    this.data = [0,0,0,0];
    this.label = "loading...";
  }
}

export class DayTileWorkout {
  icon: string;
  duration: string;

  constructor() {
    this.icon = "";
    this.duration ="";
  }
}


export class DayTile {
  date: string;
  year: number;
  timestamp: number;
  mood: string;
  steps: number;
  HR: string;
  calories: string;
  asleep_time: string;
  awake_time: string;
  active_time: string;
  distance: string;
  distance_width: string;
  distance_avg_width: string;
  sleep_duration: string;
  sleep_duration_max: string;
  sleep_duration_avg: string;
  sleep_duration_width: string;
  sleep_duration_avg_width: string;
  workouts: Array<DayTileWorkout>;

  constructor() {
    this.date = "";
    this.year = 2017;
    this.timestamp = 0;
    this.mood = "assets/img/sleeping.svg";
    this.steps = 0;
    this.HR = "";
    this.calories = "";
    this.asleep_time = "";
    this.awake_time = "";
    this.active_time = "";
    this.distance = "";
    this.distance_width = "";
    this.distance_avg_width = "";
    this.sleep_duration = "";
    this.sleep_duration_max = "";
    this.sleep_duration_avg = "";
    this.sleep_duration_width = "";
    this.sleep_duration_avg_width = "";
    this.workouts = new Array<DayTileWorkout>();
  }
}

