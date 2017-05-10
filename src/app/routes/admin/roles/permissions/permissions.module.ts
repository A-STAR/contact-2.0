import { NgModule } from '@angular/core';

import {
  DialogModule,
  ButtonModule,
} from 'primeng/primeng';

import { SharedModule } from '../../../../shared/shared.module';
import { PermissionsComponent } from './permissions.component';
import { AddPermissionComponent } from './permissions-add/add.permission.component';
import { EditPermissionComponent } from './permissions-edit/edit.permission.component';
import { RemovePermissionComponent } from './permissions-remove/remove.permission.component';

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    SharedModule,
  ],
  exports: [
    PermissionsComponent,
  ],
  declarations: [
    PermissionsComponent,
    AddPermissionComponent,
    EditPermissionComponent,
    RemovePermissionComponent,
  ]
})
export class PermissionsModule {
}
