import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { UserGridModule } from './grid/user-grid.module';

import { UsersService } from './users.service';

import { UserGridComponent } from './grid/user-grid.component';

const routes: Routes = [
  {
    path: '',
    component: UserGridComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    UserGridModule
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    UsersService,
  ]
})
export class UsersModule { }
