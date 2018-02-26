import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { PhoneGridComponent } from './phone.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    PhoneGridComponent,
  ],
  declarations: [
    PhoneGridComponent
  ]
})
export class PhoneGridModule {}
