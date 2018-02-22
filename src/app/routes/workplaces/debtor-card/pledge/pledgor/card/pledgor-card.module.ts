import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { PledgorGridModule } from '../grid/pledgor-grid.module';

import { PledgorCardComponent } from './pledgor-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PledgorGridModule,
  ],
  exports: [
    PledgorCardComponent,
  ],
  declarations: [
    PledgorCardComponent,
  ],
  entryComponents: [
    PledgorCardComponent,
  ]
})
export class PledgorCardModule { }
