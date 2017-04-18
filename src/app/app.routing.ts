import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './components/home.component';
import {CompanyComponent} from './components/company.component';

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
