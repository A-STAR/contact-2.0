import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityGroupGridModule } from './grid/entity-group-grid.module';
import { EntityGroupDialogModule } from './dialog/entity-group-dialog.module';

import { EntityGroupService } from './entity-group.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    EntityGroupGridModule,
    EntityGroupDialogModule,
  ],
  providers: [
    EntityGroupService,
  ]
})
export class EntityGroupModule { }
