import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorPropertyCardComponent } from './property-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DebtorPropertyCardComponent,
  ],
  declarations: [
    DebtorPropertyCardComponent,
  ]
})
export class PropertyCardModule { }
