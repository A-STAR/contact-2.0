import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { PermissionsComponent } from './permissions.component';
import { AddPermissionComponent } from './add/add.permission.component';
import { EditPermissionComponent } from './edit/edit.permission.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    PermissionsComponent,
    AddPermissionComponent,
    EditPermissionComponent,
  ],
  providers: [
    DatePipe,
  ]
})
export class PermissionsModule {}
