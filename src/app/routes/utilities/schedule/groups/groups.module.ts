import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { GroupGridModule } from './grid/group-grid.module';
import { GroupEventsModule } from './events/group-events.module';

import { GroupsService } from './groups.service';

import { GroupsComponent } from './groups.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    GroupGridModule,
    GroupEventsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    GroupsComponent
  ],
  providers: [
    GroupsService,
  ]
})
export class GroupsModule { }
