import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { PermissionsTreeComponent } from './permissions-tree.component';
import { PermissionsTreeService } from './permissions-tree.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PermissionsTreeComponent,
  ],
  declarations: [
    PermissionsTreeComponent,
  ],
  providers: [
    PermissionsTreeService,
  ]
})
export class PermissionsTreeModule {
}
