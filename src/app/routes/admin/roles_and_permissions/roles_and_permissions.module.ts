import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DialogModule, ButtonModule} from 'primeng/primeng';

import {SharedModule} from '../../../shared/shared.module';
import {PermissionsComponent} from './permissions.component';
import {AddPermissionComponent} from './add.permission.component';
import {EditPermissionComponent} from './edit.permission.component';
import {RemovePermissionComponent} from './remove.permission.component';
import { RolesComponent } from './roles.component';
import { RolesAndPermissionsComponent } from './roles-and-permissions.component';

const routes: Routes = [
  {path: '', component: RolesAndPermissionsComponent},
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
    RolesComponent,
    PermissionsComponent,
    AddPermissionComponent,
    EditPermissionComponent,
    RemovePermissionComponent,
  ]
})
export class RolesAndPermissionsModule {
}
