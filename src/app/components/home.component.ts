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
  public icons = {
    mood_1: "img/mood-1.svg",
    mood_2: "img/mood-2.svg",
    mood_3: "img/mood-3.svg",
    mood_4: "img/mood-4.svg",
    mood_5: "img/mood-5.svg",
    steps:"img/running.svg",
    heart_tile : "img/heart-tile.svg",
    heart_day : "img/heart-day.svg",
    bed : "img/bed.svg",
    moon_tile : "img/moon-tile.svg",
    moon_day : "img/moon-day.svg",
    sun : "img/sun.svg",
    flame :"img/flame.svg",
    soccer : "img/soccer.svg",
    dumbbell : "img/dumbbell.svg",
    bike : "img/bicycle.svg",
    clock : "img/clock.svg",
    burn : "img/burn.svg",
    desk : "img/desk.svg",
    mood : "img/sleeping.svg",
    tennis : "img/tennis.svg",
  };
  // data loaded from REST API
  todaysSleep: APIResult;
  todaysMoves: APIResult;
  todaysHR: APIResult;
  todaysMood: APIResult;
  attributes: Attributes = {
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

  todaysDate: string;
  graphWrapperState: string = 'inactive';
  summary_state: string = 'inactive';
  graphStates: GraphStates = {
    sleepGraphState: {state: "inactive", order: 1},
    calorieGraphState: {state: "inactive", order: 2},
    idleGraphState: {state: "inactive", order: 3}
  };

  constructor(private postsService: PostsService) {
    this.todaysDate = this.setTodaysDate();
    this.getTodaysAttributes(postsService);
  }


  // function to obtain the info needed to populate the todayTile
  public getTodaysAttributes(postsService) {
    // todays sleep
    postsService.getTodaysSleep().subscribe(posts => {
      this.todaysSleep = posts;
      let asleep_ts = this.todaysSleep.Items[0].info.details.asleep_time;
      this.attributes.asleep_time = new Date(asleep_ts * 1000).toTimeString().substr(0,5);
      let awake_ts = this.todaysSleep.Items[0].info.details.awake_time;
      this.attributes.awake_time = new Date(awake_ts * 1000).toTimeString().substr(0,5);
    });

    // todays moves
    postsService.getTodaysMoves().subscribe(posts => {
      this.todaysMoves = posts;
      // calories
      this.attributes.calories = Math.round(this.todaysMoves.Items[0].info.details.calories).toString();
      // idle time
      let it = new Date(null);
      it.setSeconds(this.todaysMoves.Items[0].info.details.longest_idle);
      this.attributes.idle_time = (it.toISOString().substr(11,2) + "h " + it.toISOString().substr(14,2) + "m");
      // steps
      this.attributes.steps = this.todaysMoves.Items[0].info.details.steps;
      // active time
      let at = new Date(null);
      at.setSeconds(this.todaysMoves.Items[0].info.details.active_time);
      this.attributes.active_time = (at.toISOString().substr(11,2) + "h " + at.toISOString().substr(14,2) + "m");
    });

    // todays heartrate
    postsService.getTodaysHR().subscribe(posts => {
      this.todaysHR = posts;
      this.attributes.HR = this.todaysHR.Items[0].heartrate;
    });

    // todays mood
    postsService.getTodaysMood().subscribe(posts => {
      this.todaysMood = posts;
      if (this.todaysMood.Count !== 0) {
        let mood = this.todaysMood.Items[0].mood;
        this.attributes.mood = this.icons["mood_" + mood];
      }
    })

    // stats



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




// lineChart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';


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
}

export interface APIResult {
  Items:Array<any>;
  Count: number;

}

