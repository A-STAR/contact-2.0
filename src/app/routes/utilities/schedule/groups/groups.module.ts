import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { GroupGridModule } from './grid/group-grid.module';

import { GroupsService } from './groups.service';

import { GroupGridComponent } from './grid/group-grid.component';

const routes: Routes = [
  {
    path: '',
    component: GroupGridComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    GroupGridModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    GroupsService,
  ]
})
export class GroupsModule { }
