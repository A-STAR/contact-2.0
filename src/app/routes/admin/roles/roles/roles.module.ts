import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RolesComponent } from './roles.component';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { RolesCopyComponent } from './roles-copy/roles-copy.component';
import { RolesService } from './roles.service';

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
  providers: [
    RolesService
  ]
})
export class RolesModule {
}
