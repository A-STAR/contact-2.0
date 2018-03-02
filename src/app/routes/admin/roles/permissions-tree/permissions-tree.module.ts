import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { PermissionsTreeService } from './permissions-tree.service';

import { PermissionsTreeComponent } from './permissions-tree.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionsTreeComponent,
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
    PermissionsTreeComponent,
  ],
  providers: [
    PermissionsTreeService,
  ]
})
export class PermissionsTreeModule {}
