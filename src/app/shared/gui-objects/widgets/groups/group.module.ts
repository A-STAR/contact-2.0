import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupGridModule } from './grid/group-grid.module';
import { GroupCardModule } from './card/group-card.module';

import { GroupService } from './group.service';
import { Routes } from '@angular/router';

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
  ],
  // exports: [
  //   GroupGridModule,
  //   GroupCardModule,
  // ],
  providers: [
    GroupService,
  ]
})
export class GroupModule { }
