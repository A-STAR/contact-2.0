import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule as RolesGridModule } from './roles/roles.module';

import { RolesAndPermissionsComponent } from './roles-and-permissions.component';

const routes: Routes = [
  {path: '', component: RolesAndPermissionsComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    PermissionsModule,
    RolesGridModule,
    SharedModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    RolesAndPermissionsComponent,
  ]
})
export class RolesModule {
}
