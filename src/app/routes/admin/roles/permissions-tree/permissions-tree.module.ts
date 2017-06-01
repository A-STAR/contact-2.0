import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { PermissionsTreeComponent } from './permissions-tree.component';

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
})
export class PermissionsTreeModule {
}
