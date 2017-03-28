import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';

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

  ]
})
export class HomeComponent {
  public mood_face: string; public steps_icon: string;
  public HR_icon: string; public bed_icon: string;
  public moon_tile_icon: string; public sun_icon: string;
  public flame_icon: string; public football_icon: string;
  public dumbbell_icon: string; public bike_icon: string;
  public clock_icon: string; public heart_icon: string;
  public desk_icon: string; public burn_icon: string;
  public moon_day_icon: string;

  todaysDate: string;
  graphWrapperState: string = 'inactive';
  summary_state: string = 'inactive';
  graphStates: GraphStates = {
    sleepGraphState: {state: "inactive", order: 1},
    calorieGraphState: {state: "inactive", order: 2},
    idleGraphState: {state: "inactive", order: 3}
  };

  constructor() {
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
    responsive: false
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

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
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



