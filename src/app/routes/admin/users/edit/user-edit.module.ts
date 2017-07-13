import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { UserLdapDialogModule } from './ldap-dialog/user-ldap-dialog.module';

import { UserEditComponent } from './user-edit.component';

@NgModule({
  imports: [
    SharedModule,
    UserLdapDialogModule,
  ],
  exports: [
    UserEditComponent,
  ],
  declarations: [
    UserEditComponent,
  ]
})
export class UserEditModule { }
