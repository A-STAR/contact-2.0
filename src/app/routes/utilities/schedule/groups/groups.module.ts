import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

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
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    GroupsService,
  ],
  declarations: [
    GroupGridComponent
  ]
})
export class GroupsModule { }
