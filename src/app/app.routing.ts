import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './components/home.component';
import {CompanyComponent} from './components/company.component';

// defines where which component is loaded depending on the path of the URL
const appRoutes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
