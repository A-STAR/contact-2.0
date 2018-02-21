import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { GuarantorGridComponent } from './guarantor-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    GuarantorGridComponent,
  ],
  declarations: [
    GuarantorGridComponent,
  ],
})
export class GuarantorGridModule { }
