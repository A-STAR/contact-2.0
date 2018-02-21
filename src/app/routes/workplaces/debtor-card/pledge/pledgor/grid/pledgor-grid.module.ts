import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { PledgorGridComponent } from './pledgor-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PledgorGridComponent,
  ],
  declarations: [
    PledgorGridComponent,
  ],
  entryComponents: [
    PledgorGridComponent,
  ]
})
export class PledgorGridModule { }
