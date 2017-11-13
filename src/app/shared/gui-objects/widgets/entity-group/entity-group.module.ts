import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityGroupGridModule } from './grid/entity-group-grid.module';

import { EntityGroupService } from './entity-group.service';

@NgModule({
  imports: [
    EntityGroupGridModule,
    CommonModule,
  ],
  exports: [
    EntityGroupGridModule,
  ],
  providers: [
    EntityGroupService,
  ]
})
export class EntityGroupModule { }
