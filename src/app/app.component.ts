import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <nav class="header">
      <div class="navLeft">
        <h1 class="welcomeMessage">Welcome, Bhavnit</h1>
      </div>
      <div class="navMiddle">
        <ul class="navigation">
          <li><a routerLink="/" 
                 [style.backgroundColor] = "userBGColor" 
                 [style.color] = "userColor" 
                 (click) = "selectUser()" >User</a></li>
          <li><a routerLink="/company" 
                 [style.backgroundColor] = "companyBGColor" 
                 [style.color] = "companyColor" 
                 (click) = "selectCompany()" >Company</a></li>
        </ul>
      </div>
      <div class="navRight">

      </div>

    </nav>
    <router-outlet></router-outlet>
  `
})

export class AppComponent {
  userSelected: boolean;
  companySelected: boolean;
  userColor: string;
  companyColor: string;
  userBGColor: string;
  companyBGColor: string;

  constructor(@Inject(DOCUMENT) private document: any) {
    if (this.document.location.href.toString().indexOf("company") > -1) {
      this.selectCompany();
    } else {
      this.selectUser();
    }


  }

  public selectUser() {
    this.userSelected = true;
    this.companySelected = false;

    this.userColor = '#00838F';
    this.userBGColor = '#FFFFFF';

    this.companyColor = '#FFFFFF';
    this.companyBGColor = '';
  }

  public selectCompany() {
    this.userSelected = false;
    this.companySelected = true;

    this.userColor = '#FFFFFF';
    this.userBGColor = '';

    this.companyColor = '#00838F';
    this.companyBGColor = '#FFFFFF';
  }



}
