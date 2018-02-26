import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { GuaranteeGridComponent } from './guarantee-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    GuaranteeGridComponent,
  ],
  declarations: [
    GuaranteeGridComponent,
  ],
})
export class GuaranteeGridModule {}
