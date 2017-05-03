import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogModule, ButtonModule } from 'primeng/primeng';

import { SharedModule } from '../../../shared/shared.module';
import { RolesAndPermissionsComponent } from './roles-and-permissions.component';
import { RolesComponent } from './roles.component';

const routes: Routes = [
  { path: '', component: RolesAndPermissionsComponent },
];

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    RolesAndPermissionsComponent,
    RolesComponent
  ]
})
export class RolesAndPermissionsModule { }
