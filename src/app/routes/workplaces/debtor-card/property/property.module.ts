import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';
import { PropertyCardModule } from './card/property-card.module';
import { PropertyGridModule } from './grid/property-grid.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PropertyCardModule,
    PropertyGridModule
  ],
  exports: [
    PropertyCardModule,
    PropertyGridModule
  ],
})
export class DebtorPropertyModule {}
