import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'roles',
      },
      {
        path: 'constants',
        loadChildren: './constants/constants.module#ConstantsModule',
      },
      {
        path: 'roles',
        loadChildren: './roles/roles.module#RolesModule',
      },
      {
        path: 'dictionaries',
        loadChildren: './dictionaries/dictionaries.module#DictionariesModule',
      },
      {
        path: 'users',
        loadChildren: './users/users.module#UsersModule',
      },
      {
        path: 'organizations',
        loadChildren: './organizations/organizations.module#OrganizationsModule',
      },
      {
        path: 'action-log',
        loadChildren: './actions-log/actions-log.module#ActionsLogModule',
      },
      {
        path: 'contractors',
        loadChildren: './contractors-and-portfolios/contractors-and-portfolios.module#ContractorsAndPortfoliosModule',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    AdminComponent,
  ],
})
export class AdminModule {}
