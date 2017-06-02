import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule as RolesGridModule } from './roles/roles.module';
import { PermissionsTreeModule } from './permissions-tree/permissions-tree.module';

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
    PermissionsTreeModule,
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
