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
})
export class HomeComponent {
  todaysDate: string;
  graphStates: GraphStates = {sleepGraphState: "inactive", calorieGraphState: "inactive", idleGraphState: "inactive"};
  graphWrapperState: string = 'inactive';
  summary_state: string = 'inactive';

  constructor() {
    this.todaysDate = this.setTodaysDate();
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


  toggleMove() {
    this.summary_state = (this.summary_state === 'inactive' ? 'active' : 'inactive');
  }

  toggleGraph(graphID) {
    // show/hide the background tile depending on if there are any graphs visible
    if (this.graphStates[graphID] == 'inactive') {
      // we want to show a tile so show wrapper if not already visibile
      if(this.noGraphsActive() == 0) {
          this.graphWrapperState = 'active';
      }
    } else {
      // we want to hide a tile so hide wrapper if its the last tile
      if(this.noGraphsActive() == 1) {
        this.graphWrapperState = 'inactive';
      }
    }


     // toggle relevant graph state
    this.graphStates[graphID] = (this.graphStates[graphID] === 'inactive' ? 'active' : 'inactive');
  }


  private noGraphsActive():number {
    var activeCount = 0;
    for (var key in this.graphStates) {
      var attrName = key.toString();
      var value = this.graphStates[attrName];
      if (value == 'active') {
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
}

interface GraphStates {
  sleepGraphState: string;
  calorieGraphState: string;
  idleGraphState: string;
}
