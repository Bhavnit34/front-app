import { Component } from '@angular/core';
import { PostsService } from '../services/posts.service';
import {Observable} from "rxjs";


@Component({
  selector: 'company',
  templateUrl: 'company.component.html',
  styleUrls: ['../../company-styles.css'],
  providers: [PostsService]
})


export class CompanyComponent {
  todaysDate: string;
  public icons = {
    mood_1: "assets/img/mood-1.svg",
    mood_2: "assets/img/mood-2.svg",
    mood_3: "assets/img/mood-3.svg",
    mood_4: "assets/img/mood-4.svg",
    mood_5: "assets/img/mood-5.svg",
    steps_tile: "assets/img/footprints-tile.svg",
    steps_day: "assets/img/footprints-day.svg",
    heart_tile: "assets/img/heart-tile.svg",
    heart_day: "assets/img/heart-day.svg",
    bed: "assets/img/bed.svg",
    moon_tile: "assets/img/moon-tile.svg",
    moon_day: "assets/img/moon-day.svg",
    sun: "assets/img/sun.svg",
    flame_tile: "assets/img/flame-tile.svg",
    flame_day: "assets/img/flame-day.svg",
    soccer: "assets/img/soccer.svg",
    dumbbell_tile: "assets/img/dumbbell-tile.svg",
    dumbbell_day: "assets/img/dumbbell-day.svg",
    bike: "assets/img/bicycle.svg",
    clock: "assets/img/clock.svg",
    burn_tile: "assets/img/burn_tile.svg",
    burn_day: "assets/img/burn_day.svg",
    desk: "assets/img/desk.svg",
    mood: "assets/img/sleeping.svg",
    tennis: "assets/img/tennis.svg",
    running_tile: "assets/img/running-tile.svg",
    running_day: "assets/img/running-day.svg",
    percentage: "assets/img/percentage.svg"
  };
  tableAttributes : TableAttributes = {
    // moves
    steps: "0",
    calories : "0",
    active_time : "0h 0m",
    distance : "0",
    // sleeps
    REM  : "0h 0m",
    deep : "0h 0m",
    light : "0h 0m",
    sleep_duration : "0h 0m",
    // workouts
    wo_logged : "0",
    wo_duration : "0h 0m",
    wo_distance : "0",
    wo_calories : "0",
    // percentages
    wo_we_percentage : "0",
    wo_summary_percentage : "0",
    day_summary_percentage : "0",
    sleep_summary_percentage : "0"
  };
  public  day_names = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  constructor(postsService: PostsService) {
    this.todaysDate = this.setTodaysDate();
    this.populateWearableStats(postsService);
    this.populatePercentages(postsService);
    this.populateMoodGraph(postsService);
    this.populateSleepGraph(postsService);
    this.populateWorkoutGraph(postsService);
    this.populateStepGraph(postsService);
    this.populateDeepAndHRGraph(postsService);
  }

  // function to set the current date on the page
  private setTodaysDate(): string {
    const days: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today = new Date();
    const day = days[today.getDay()];
    const month = months[today.getMonth()];
    const wholeDate = day + " " + today.getDate() + " " + month + " " + today.getFullYear();
    return wholeDate;
  }

  // function to populate the company top table
  private populateWearableStats(postsService) {
      let json = [];

      function populateJSON() {
        return Observable.create(observer => {
          postsService.getStats("bhav").subscribe(posts => {
            json.push(posts);
            postsService.getStats("dan").subscribe(posts => {
              json.push(posts);
              observer.next();
              observer.complete();
            });
          });
        });
      }

      populateJSON().subscribe((data) => {

        // now calculate the totals from all users
        let totals = {
          steps: 0, calories: 0, distance: 0, activeTime: 0,
          sleep_duration: 0, REM: 0, light: 0, deep: 0,
          wo_count: 0, wo_calories: 0, wo_distance: 0, wo_duration: 0
        };

        for (let i = 0; i < json.length; i++) {
          // moves
          totals.steps += json[i].Items[0].info.Moves.Steps.total;
          totals.calories += json[i].Items[0].info.Moves.Calories.total;
          totals.distance += json[i].Items[0].info.Moves.Distance.total;
          totals.activeTime += json[i].Items[0].info.Moves.Active_time.total;

          // sleeps
          totals.sleep_duration += json[i].Items[0].info.Sleep.Duration.total;
          totals.REM += json[i].Items[0].info.Sleep.REM.total;
          totals.light += json[i].Items[0].info.Sleep.Light.total;
          totals.deep += json[i].Items[0].info.Sleep.Deep.total;

          // workouts
          totals.wo_count += json[i].Items[0].info.Workouts.Count.count;
          totals.wo_calories += json[i].Items[0].info.Workouts.Calories.total;
          totals.wo_distance += json[i].Items[0].info.Workouts.Distance.total;
          totals.wo_duration += json[i].Items[0].info.Workouts.Time.total;
        }

        // moves
        this.tableAttributes.steps = totals.steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.tableAttributes.calories = Math.round(totals.calories).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.tableAttributes.distance = Math.round(totals.distance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.tableAttributes.active_time = this.calculateTime(totals.activeTime);


        // sleeps
        this.tableAttributes.sleep_duration = this.calculateTime(totals.sleep_duration);
        this.tableAttributes.light = this.calculateTime(totals.light);
        this.tableAttributes.REM = this.calculateTime(totals.REM);
        this.tableAttributes.deep = this.calculateTime(totals.deep);

        // workouts
        this.tableAttributes.wo_logged = totals.wo_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.tableAttributes.wo_calories = Math.round(totals.wo_calories).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.tableAttributes.wo_distance = Math.round(totals.wo_distance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.tableAttributes.wo_duration = this.calculateTime(totals.wo_duration);
      });
  }

  private calculateTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let mins = Math.round((seconds - (hours * 3600)) / 60);
    return (hours + "h " + mins + "m");
  }

  private populatePercentages(postsService) {
    // Workout weather and mood
    postsService.getAllRowsForAttr("Workouts").subscribe(posts => {
      let weather_associated_count = 0;
      let wo_mood_count = 0;
      for (let i = 0; i < posts.Count; i++) {
        if (posts.Items[i].hasOwnProperty('weather')) {
          weather_associated_count++;
        }
        if (posts.Items[i].hasOwnProperty('mood')) {
          wo_mood_count++;
        }
      }


      this.tableAttributes.wo_we_percentage = ((weather_associated_count / posts.Count) * 100).toFixed(2);
      this.tableAttributes.wo_summary_percentage = ((wo_mood_count / posts.Count) * 100).toFixed(2);
    });

    // day summary
    postsService.getRowCountForAttr("Moves").subscribe(moves => {
      postsService.getRowCountForAttr("DailyMood").subscribe(moods => {
        if(moves.hasOwnProperty("Table") && moods.hasOwnProperty("Table")) {
          this.tableAttributes.day_summary_percentage = ((moods.Table.ItemCount / moves.Table.ItemCount) * 100).toFixed(2);
        }
      })
    });

    // sleep summary
    postsService.getAllRowsForAttr("Sleeps").subscribe(sleeps => {
      let sleep_summary_count = 0;
      for (let i = 0; i < sleeps.Count; i++) {
        if (sleeps.Items[i].hasOwnProperty("mood")) {
          sleep_summary_count++;
        }
      }
      this.tableAttributes.sleep_summary_percentage = ((sleep_summary_count / sleeps.Count) * 100).toFixed(2);
    });
  }

  private populateMoodGraph(postsService) {
    postsService.getAttrForLatestWeek("Mood", "Bhav").subscribe(bhav => {
      postsService.getAttrForLatestWeek("Mood", "dan").subscribe(dan => {
        let labels = [];
        let bhavData = {label: "Bhavnit", data: []};
        let danData = {label: "Dan", data: []};
        let now = new Date();
        let d = new Date();
        d.setDate(d.getDate() - 7);
        d.setHours(0,0,0,0);
        let found = false;

        while (d.getDate() != now.getDate()) {
          let ts = d.getTime().toString().substr(0, 10);
          labels.push(this.day_names[d.getDay()]);

          for (let i = 0; i < bhav.Count; i++) {
            if (bhav.Items[i].timestamp_completed.toString() == ts) {
              bhavData.data.push(bhav.Items[i].mood);
              found = true;
              break;
            }
          }
          if (!found) { bhavData.data.push(0)}
          found = false;
          for (let i = 0; i < dan.Count; i++) {
            if (dan.Items[i].timestamp_completed.toString() == ts) {
              danData.data.push(dan.Items[i].mood);
              found = true;
              break;
            }
          }
          if (!found) { danData.data.push(0)}
          found = false;
          d.setDate(d.getDate() + 1);
          d.setHours(0,0,0,0);
        }

        this.moodChartData = [danData, bhavData];

        setTimeout(() => {
          this.moodChartLabels = labels;
        }, 2000);

      })
    })
  }

  private populateSleepGraph(postsService) {
    postsService.getAttrForLatestWeek("sleeps", "bhav").subscribe(bhav => {
      postsService.getAttrForLatestWeek("sleeps", "dan").subscribe(dan => {
        let labels = [];
        let bhavData = {label: "Bhavnit", data: []};
        let danData = {label: "Dan", data: []};


        let now = new Date();
        let d = new Date();
        d.setDate(d.getDate() - 7);
        d.setHours(0,0,0,0);
        let found = false;

        while (d.getDate() != now.getDate()) {
          let ts = d.getTime().toString().substr(0, 10);
          labels.push(this.day_names[d.getDay()]);

          for (let i = 0; i < bhav.Count; i++) {
            let cd = new Date(bhav.Items[i].timestamp_completed * 1000);
            cd.setHours(0,0,0,0);
            if (cd.getTime().toString().substr(0,10) == ts) {
              bhavData.data.push((bhav.Items[i].info.details.duration / 3600).toFixed(2));
              found = true;
              break;
            }
          }
          if (!found) { bhavData.data.push(0)}
          found = false;
          for (let i = 0; i < dan.Count; i++) {
            let cd = new Date(dan.Items[i].timestamp_completed * 1000);
            cd.setHours(0,0,0,0);
            if (cd.getTime().toString().substr(0,10) == ts) {
              danData.data.push((dan.Items[i].info.details.duration / 3600).toFixed(2));
              found = true;
              break;
            }
          }
          if (!found) { danData.data.push(0)}
          found = false;
          d.setDate(d.getDate() + 1);
          d.setHours(0,0,0,0);
        }

        this.sleepChartData = [danData, bhavData];

        setTimeout(() => {
          this.sleepChartLabels = labels;
        }, 2000);

      })
    })
  }


  private populateWorkoutGraph(postsService) {
    postsService.getAttrForLatestWeek("workouts", "bhav").subscribe(bhav => {
      postsService.getAttrForLatestWeek("workouts", "dan").subscribe(dan => {
        let posts = [bhav, dan];
        let workoutGraphLabels = [];
        let workoutGraphSeries = [];

        for(let i = 0; i < posts.length; i++) {
          let workouts = {};
          if (posts[i].Count == 0) {
            continue;
          }

          // create a set of each workout and it's total duration over the past week
          for (let j = 0; j < posts[i].Count; j++) {
            let wo = posts[i].Items[j].info;
            if (workouts.hasOwnProperty(wo.title)){
              workouts[wo.title] += (wo.details.time);
            } else {
              workouts[wo.title] = (wo.details.time);
            }
          }

          // push each number into the series array
          for (let key in workouts) {
            if (workouts.hasOwnProperty(key)) {
              workoutGraphLabels.push(key);
              let value = parseFloat(workouts[key]);
              workoutGraphSeries.push((value / 3600).toFixed(2));
            }
          }
        }

        this.doughnutChartData = workoutGraphSeries;
        setTimeout(() => {
          this.doughnutChartLabels = workoutGraphLabels;
        }, 1000)

      });
    });
  }

  private populateStepGraph(postsService) {
    postsService.getAttrForLatestWeek("moves", "bhav").subscribe(bhav => {
      postsService.getAttrForLatestWeek("moves", "dan").subscribe(dan => {
        let labels = [];
        let bhavData = {label: "Bhavnit", data: []};
        let danData = {label: "Dan", data: []};
        let now = new Date();
        let d = new Date();
        d.setDate(d.getDate() - 7);
        d.setHours(0,0,0,0);
        let found = false;

        while (d.getDate() != now.getDate()) {
          let ts = d.getTime().toString().substr(0, 10);
          labels.push(this.day_names[d.getDay()]);

          for (let i = 0; i < bhav.Count; i++) {
            let cd = new Date(bhav.Items[i].timestamp_completed * 1000);
            cd.setHours(0,0,0,0);
            if (cd.getTime().toString().substr(0,10) == ts) {
              bhavData.data.push(bhav.Items[i].info.details.steps);
              found = true;
              break;
            }
          }
          if (!found) { bhavData.data.push(0)}
          found = false;
          for (let i = 0; i < dan.Count; i++) {
            let cd = new Date(dan.Items[i].timestamp_completed * 1000);
            cd.setHours(0,0,0,0);
            if (cd.getTime().toString().substr(0,10) == ts) {
              danData.data.push(dan.Items[i].info.details.steps);
              found = true;
              break;
            }
          }
          if (!found) { danData.data.push(0)}
          found = false;
          d.setDate(d.getDate() + 1);
          d.setHours(0,0,0,0);
        }

        this.stepChartData = [danData, bhavData];

        setTimeout(() => {
          this.stepChartLabels = labels;
        }, 2000);

      })
    })
  }

  private populateDeepAndHRGraph(postsService) {
    postsService.getAllRowsForAttr("WeeklyStats").subscribe(posts => {
      let labels = [];
      let bhavData = {label: "Bhavnit", data: []};
      let danData = {label: "Dan", data: []};
      let bhavHRData = {label: "Bhavnit", data: []};
      let danHRData = {label: "Dan", data: []};

      let bhavFound = false;
      let danFound = false;

      let now = new Date();
      let d = new Date("2017/03/05");
      d.setHours(0,0,0,0);
      let found = false;

      while (d.getTime() <= now.getTime()) {
        let ts = d.getTime().toString().substr(0, 10);
        labels.push(d.toDateString().split(" ").splice(1,2).join(" "));

        for (let i = 0; i < posts.Count; i++) {
          if (posts.Items[i].timestamp_weekStart == ts) {
            if (posts.Items[i].user_id == "BRx5p_mMpSn-RjknXdn3dA") {
              bhavData.data.push(Math.round(posts.Items[i].info.Sleep.Deep.avg / 60) || 0);
              bhavHRData.data.push(posts.Items[i].info.HeartRate.avg || 0);
              bhavFound = true;

            } else {
              danData.data.push(Math.round(posts.Items[i].info.Sleep.Deep.avg / 60) || 0);
              danHRData.data.push(posts.Items[i].info.HeartRate.avg || 0);
              danFound = true;
            }
          }
        }
        if(!bhavFound) { bhavData.data.push(0)}
        if(!danFound) { danData.data.push(0)}
        bhavFound = false;
        danFound = false;
        d.setDate(d.getDate() + 7);
        d.setHours(0,0,0,0);
      }
      /*
      console.log(JSON.stringify(labels));
      console.log("bhav : " + JSON.stringify(bhavData, null, 2));
      console.log("dan : " + JSON.stringify(danData, null, 2));
      */

      this.deepChartData = [bhavData, danData];
      this.HRChartData = [bhavHRData, danHRData];
      setTimeout(() => {
        this.deepChartLabels = labels;
        this.HRChartLabels = labels;
      }, 1000)

    })
  }


  // LINE CHART
  public lineChartType:string = 'line';
  public lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'mood'
        }
      }]
    }
  };
  public lineChartLegend:boolean = true;
  public moodChartData:Array<any> = [
    {data: [], label: 'Bhavnit'},
    {data: [], label: 'Dan'}
  ];

  // Mood Graph
  public barChartType:string = 'bar';
  public moodChartLabels:Array<any> = [];
  public avgChartColors:Array<any> = [
    { // bhavnit
      backgroundColor: '#F4CC70',
      borderColor: '#F4CC70',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dan
      backgroundColor: '#5BC8AC',
      borderColor: '#5BC8AC',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#FFF',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public moodChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'mood (5 = Excellent)'
        }
      }]
    }
  };

  // sleep graph
  public sleepChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'hours'
        }
      }]
    }
  };
  public sleepChartData:Array<any> = [
    {data: [], label: 'Bhavnit'},
    {data: [], label: 'Dan'}
  ];
  public sleepChartLabels:Array<any> = [];
  public sleepChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.5)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: '#7ec0ee',
      borderColor: '#7ec0ee',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#FFF',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }

  ];





  // doughnut chart
  public doughnutChartLabels:string[] = [];
  public doughnutChartData:number[] = [];
  public doughnutChartType:string = 'doughnut';
  doughnutChartColors: any[] = [{ backgroundColor: ["#000B29", "#D70026", "#EDB83D", "#F8F5F2"] ,
    borderColor: "#EEEEFF"}];
  public doughnutChartOptions:any = {
    responsive: true,
    animation:{animateScale: true},
    maintainAspectRatio: false,
  };


  // step charts
  public stepChartData:Array<any> = [
    {data: [], label: 'Bhavnit'},
    {data: [], label: 'Dan'}
  ];
  public stepChartLabels:Array<any> = [];
  public stepChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'steps'
        }
      }]
    }
  };
  public stepChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(0,11,41,0.7)',
      borderColor: 'rgba(0,11,41,0.7)',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,11,41,0.5)',
    },
    {
      backgroundColor: 'rgba(215, 0, 38, 1)',
      borderColor: 'rgba(215, 0, 38, 1)',
      pointBackgroundColor: '#FFF',
      pointHoverBackgroundColor: '#FFF',
      pointHoverBorderColor: 'rgba(215, 0, 38, 1)',
    }

  ];

  // deep sleep charts
  public deepChartData:Array<any> = [
    {data: [], label: 'Bhavnit'},
    {data: [], label: 'Dan'}
  ];
  public deepChartLabels:Array<any> = [];
  public deepChartOptions:any = {
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

  // HR chart
  public HRChartData:Array<any> = [
    {data: [], label: 'Bhavnit'},
    {data: [], label: 'Dan'}
  ];
  public HRChartLabels:Array<any> = [];
  public HRChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'bpm'
        },
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

} // end component


export interface APIResult {
  Items:Array<any>;
  Count: number;
}

export interface TableAttributes {
  // moves
  steps: string;
  calories: string;
  active_time: string;
  distance: string;
  // sleeps
  REM: string;
  deep: string;
  light: string;
  sleep_duration: string;
  // workouts
  wo_logged: string;
  wo_duration: string;
  wo_distance: string;
  wo_calories: string;
  // percentages
  wo_we_percentage: string;
  wo_summary_percentage: string;
  day_summary_percentage: string;
  sleep_summary_percentage: string;

}
