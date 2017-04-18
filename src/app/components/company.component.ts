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
    dumbbell: "assets/img/dumbbell.svg",
    bike: "assets/img/bicycle.svg",
    clock: "assets/img/clock.svg",
    burn_tile: "assets/img/burn_tile.svg",
    burn_day: "assets/img/burn_day.svg",
    desk: "assets/img/desk.svg",
    mood: "assets/img/sleeping.svg",
    tennis: "assets/img/tennis.svg",
    running_tile: "assets/img/running-tile.svg",
    running_day: "assets/img/running-day.svg"
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


  constructor(postsService: PostsService) {
    this.todaysDate = this.setTodaysDate();
    this.populateWearableStats(postsService);
    this.populatePercentages(postsService);

    setTimeout(() =>{
      console.log(JSON.stringify(this.tableAttributes, null, 2));
    }, 4000);
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
