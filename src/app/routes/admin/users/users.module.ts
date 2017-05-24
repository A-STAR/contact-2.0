import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { UserEditModule } from './edit/user-edit.module';
import { UsersService } from './users.service';
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
  ],
  providers: [
    UsersService,
  ]
})
export class UsersModule { }
