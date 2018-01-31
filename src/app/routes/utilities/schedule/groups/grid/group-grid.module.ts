import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { GroupsService } from '../groups.service';

import { GroupGridComponent } from './group-grid.component';

const routes: Routes = [
  {
    path: '',
    component: GroupGridComponent,
    data: {
      reuse: true,
    }
  },
  {
    path: 'create',
    loadChildren: './card/group-card.module#GroupCardModule',
  },
  {
    path: ':groupId',
    loadChildren: './card/group-card.module#GroupCardModule',
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    GroupGridComponent,
  ],
  declarations: [
    GroupGridComponent,
  ],
  providers: [
    GroupsService
  ]
})
export class GroupGridModule { }
