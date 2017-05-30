import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';
import { PermissionsComponent } from './permissions.component';
import { AddPermissionComponent } from './add/add.permission.component';
import { EditPermissionComponent } from './edit/edit.permission.component';
import { PermissionsService } from './permissions.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PermissionsComponent,
  ],
  declarations: [
    PermissionsComponent,
    AddPermissionComponent,
    EditPermissionComponent,
  ],
  providers: [
    PermissionsService,
    DatePipe,
  ]
})
export class PermissionsModule {
}
