import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DialogModule, ButtonModule} from 'primeng/primeng';

import { SharedModule } from '../../../shared/shared.module';
import { RolesAndPermissionsComponent } from './roles-and-permissions.component';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule as RolesGridModule } from './roles/roles.module';

const routes: Routes = [
  {path: '', component: RolesAndPermissionsComponent},
];

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    RouterModule.forChild(routes),
    SharedModule,
    PermissionsModule,
    RolesGridModule,
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
