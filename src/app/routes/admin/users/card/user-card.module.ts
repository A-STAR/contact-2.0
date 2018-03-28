import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { UserLdapDialogModule } from './ldap-dialog/user-ldap-dialog.module';

import { UsersService } from '@app/routes/admin/users/users.service';

import { UserCardComponent } from './user-card.component';

const routes: Routes = [
  {
    path: '',
    component: UserCardComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    UserLdapDialogModule,
  ],
  exports: [
    UserCardComponent,
  ],
  providers: [
    UsersService,
  ],
  declarations: [
    UserCardComponent,
  ]
})
export class UserCardModule { }
