import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneCardModule } from './card/phone-card.module';
import { PhoneGridModule } from './grid/phone-grid.module';

import { PhoneService } from './phone.service';

@NgModule({
  imports: [
    CommonModule,
    PhoneCardModule,
    PhoneGridModule,
  ],
  exports: [
    PhoneCardModule,
    PhoneGridModule,
  ],
  providers: [
    PhoneService,
  ]
})
export class PhoneModule { }
