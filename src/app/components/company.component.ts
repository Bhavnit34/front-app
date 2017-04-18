import { Component } from '@angular/core';
import { PostsService } from '../services/posts.service';

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
    steps_tile:"assets/img/footprints-tile.svg",
    steps_day:"assets/img/footprints-day.svg",
    heart_tile : "assets/img/heart-tile.svg",
    heart_day : "assets/img/heart-day.svg",
    bed : "assets/img/bed.svg",
    moon_tile : "assets/img/moon-tile.svg",
    moon_day : "assets/img/moon-day.svg",
    sun : "assets/img/sun.svg",
    flame_tile :"assets/img/flame-tile.svg",
    flame_day: "assets/img/flame-day.svg",
    soccer : "assets/img/soccer.svg",
    dumbbell : "assets/img/dumbbell.svg",
    bike : "assets/img/bicycle.svg",
    clock : "assets/img/clock.svg",
    burn_tile : "assets/img/burn_tile.svg",
    burn_day : "assets/img/burn_day.svg",
    desk : "assets/img/desk.svg",
    mood : "assets/img/sleeping.svg",
    tennis : "assets/img/tennis.svg",
    running_tile: "assets/img/running-tile.svg",
    running_day: "assets/img/running-day.svg"
  };


  constructor() {
    this.todaysDate = this.setTodaysDate();
  }

  public setTodaysDate():string {
    const days:Array<string> = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months:Array<string> = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = new Date();
    const day = days[today.getDay()];
    const month = months[today.getMonth()];
    const wholeDate = day + " " + today.getDate() + " " + month + " " + today.getFullYear();
    return wholeDate;
  }
}
