import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneGridModule } from './grid/phone-grid.module';

@NgModule({
  imports: [
    CommonModule,
    PhoneGridModule,
  ],
  exports: [
    PhoneGridModule,
  ]
})
export class PhoneModule { }
