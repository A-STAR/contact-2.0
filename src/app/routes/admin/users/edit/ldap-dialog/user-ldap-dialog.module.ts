import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { UserLdapDialogService } from './user-ldap-dialog.service';

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
  ],
  providers: [
    UserLdapDialogService,
  ]
})
export class UserLdapDialogModule { }
