import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { RolesComponent } from './roles.component';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { RolesCopyComponent } from './roles-copy/roles-copy.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    RolesComponent,
  ],
  declarations: [
    RolesComponent,
    RolesEditComponent,
    RolesCopyComponent,
  ],
})
export class RolesModule {}
