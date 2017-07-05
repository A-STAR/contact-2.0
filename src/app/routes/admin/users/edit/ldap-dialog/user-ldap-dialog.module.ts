import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { UserLdapDialogComponent } from './user-ldap-dialog.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    UserLdapDialogComponent,
  ],
  declarations: [
    UserLdapDialogComponent,
  ]
})
export class UserLdapDialogModule { }
