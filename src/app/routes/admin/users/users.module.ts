import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { TitlebarModule } from '@app/shared/components/form/titlebar/titlebar.module';
import { UserEditModule } from './edit/user-edit.module';

import { UsersService } from './users.service';

import { UsersComponent } from './users.component';
import { UserEditComponent } from './edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: {
      reuse: true,
    },
  },
  { path: 'create', component: UserEditComponent },
  { path: ':userId', component: UserEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    TitlebarModule,
    UserEditModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    UsersComponent,
  ],
  providers: [
    UsersService,
  ]
})
export class UsersModule { }
