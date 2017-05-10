import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DialogModule, ButtonModule} from 'primeng/primeng';

import {SharedModule} from '../../../shared/shared.module';
import {PermissionsComponent} from './permissions/permissions.component';
import {AddPermissionComponent} from './permissions-add/add.permission.component';
import {EditPermissionComponent} from './permissions-edit/edit.permission.component';
import {RemovePermissionComponent} from './permissions-remove/remove.permission.component';
import { RolesComponent } from './roles.component';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { RolesRemoveComponent } from './roles-remove/roles-remove.component';
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
    RolesEditComponent,
    RolesRemoveComponent,
    PermissionsComponent,
    AddPermissionComponent,
    EditPermissionComponent,
    RemovePermissionComponent,
  ]
})
export class RolesModule {
}
