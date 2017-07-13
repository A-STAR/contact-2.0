import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../shared/shared.module';
import { UserEditModule } from './edit/user-edit.module';

import { UsersEffects } from './users.effects';
import { UsersService } from './users.service';

import { UsersComponent } from './users.component';
import { UserEditComponent } from './edit/user-edit.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'create', component: UserEditComponent },
  { path: ':id', component: UserEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    UserEditModule,
    EffectsModule.run(UsersEffects),
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
