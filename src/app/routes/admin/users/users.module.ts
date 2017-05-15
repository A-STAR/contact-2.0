import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { UserEditModule } from './user-edit/user-edit.module';
import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    UserEditModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    UsersComponent,
  ]
})
export class UsersModule { }
