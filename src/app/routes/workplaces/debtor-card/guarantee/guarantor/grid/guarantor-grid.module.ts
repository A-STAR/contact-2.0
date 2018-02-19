import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { GuarantorGridComponent } from './guarantor-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule
  ],
  exports: [
    GuarantorGridComponent,
  ],
  declarations: [
    GuarantorGridComponent,
  ],
})
export class GuarantorGridModule { }
