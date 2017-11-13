import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactLogModule } from '../../gui-objects/widgets/contact-log/contact-log.module';
import { Grid2Module } from '../grid2/grid2.module';

import { ActionGridComponent } from './action-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ContactLogModule,
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
