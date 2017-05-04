import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DialogModule, ButtonModule} from 'primeng/primeng';

import {SharedModule} from '../../../shared/shared.module';
import {PermissionsComponent} from './permissions.component';
import {AddPermissionComponent} from './add.permission.component';
import {EditPermissionComponent} from './edit.permission.component';
import {RemovePermissionComponent} from './remove.permission.component';

const routes: Routes = [
  {path: '', component: PermissionsComponent},
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
    PermissionsComponent,
    AddPermissionComponent,
    EditPermissionComponent,
    RemovePermissionComponent,
  ]
})
export class RolesAndPermissionsModule {
}
