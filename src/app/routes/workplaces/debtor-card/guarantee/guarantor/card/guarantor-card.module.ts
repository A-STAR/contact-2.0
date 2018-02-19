import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GuarantorGridModule } from '../grid/guarantor-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { GuarantorCardComponent } from './guarantor-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GuarantorGridModule,
    TranslateModule,
  ],
  exports: [
    GuarantorCardComponent,
  ],
  declarations: [
    GuarantorCardComponent,
  ],
  entryComponents: [
    GuarantorCardComponent,
  ]
})
export class GuarantorCardModule { }
