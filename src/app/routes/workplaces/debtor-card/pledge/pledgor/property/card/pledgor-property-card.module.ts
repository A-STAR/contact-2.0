import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { PledgorPropertyGridModule } from '../grid/pledgor-property-grid.module';

import { PledgorPropertyCardComponent } from './pledgor-property-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PledgorPropertyGridModule,
  ],
  exports: [
    PledgorPropertyCardComponent,
  ],
  declarations: [
    PledgorPropertyCardComponent,
  ],
  entryComponents: [
    PledgorPropertyCardComponent,
  ]
})
export class PledgorPropertyCardModule { }
