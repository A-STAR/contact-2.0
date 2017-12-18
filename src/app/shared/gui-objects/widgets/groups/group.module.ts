import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupGridModule } from './grid/group-grid.module';

import { GroupService } from './group.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    GroupGridModule,
  ],
  providers: [
    GroupService,
  ]
})
export class GroupModule { }
