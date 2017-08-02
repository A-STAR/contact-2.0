import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneGridModule } from './grid/phone-grid.module';

import { PhoneService } from './phone.service';

@NgModule({
  imports: [
    CommonModule,
    PhoneGridModule,
  ],
  exports: [
    PhoneGridModule,
  ],
  providers: [
    PhoneService,
  ]
})
export class PhoneModule { }
