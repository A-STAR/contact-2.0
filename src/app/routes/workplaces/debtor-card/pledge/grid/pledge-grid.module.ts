import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { PledgeGridComponent } from './pledge-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PledgeGridComponent,
  ],
  declarations: [
    PledgeGridComponent,
  ],
})
export class PledgeGridModule {}
