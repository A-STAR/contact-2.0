import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactLogModule } from '../../gui-objects/widgets/contact-log/contact-log.module';
import { EntityGroupModule } from '../../gui-objects/widgets/entity-group/entity-group.module';
import { Grid2Module } from '../grid2/grid2.module';

import { ActionGridComponent } from './action-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ContactLogModule,
    EntityGroupModule,
    Grid2Module,
  ],
  exports: [
    ActionGridComponent,
  ],
  declarations: [
    ActionGridComponent,
  ]
})
export class ActionGridModule { }
