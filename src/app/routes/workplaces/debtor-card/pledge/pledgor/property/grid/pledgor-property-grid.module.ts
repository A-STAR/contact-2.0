import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { PledgorPropertyGridComponent } from './pledgor-property-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    PledgorPropertyGridComponent,
  ],
  declarations: [
    PledgorPropertyGridComponent,
  ],
})
export class PledgorPropertyGridModule {}
