import { Component } from '@angular/core';

@Component({
  selector: 'user',
  templateUrl: '../app.component.html'
  //styleUrls: ['../app.component.css']
})
export class UserComponent {
  name: string;
  address: address;
  hobbies: string[];
  showHobbies : boolean;

  constructor(){
    this.name = "Bhavnit Patel";
    this.address = {
      street: "40 Granville",
      city: "Loughborough"
    };
    this.hobbies = ["football", "music", "games"];
    this.showHobbies = true;
  }

   toggleHobbies() {
     if(this.showHobbies == true) {
       this.showHobbies = false;
     } else {
       this.showHobbies = true;
     }
  }

  addHobby(hobby){
    this.hobbies.push(hobby);
  }

  deleteHobby(i){
    this.hobbies.splice(i,1);
  }

}


interface address {
  street: string;
  city: string;
}
