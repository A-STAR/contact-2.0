import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../components/dialog/dialog.module';

import { PaymentConfirmDialogComponent } from './payment-confirm-dialog.component';


@NgModule({
  imports: [
    DialogModule,
    TranslateModule,
  ],
  exports: [
    PaymentConfirmDialogComponent,
  ],
  declarations: [
    PaymentConfirmDialogComponent,
  ]
})
export class PaymentConfirmDialogModule { }
