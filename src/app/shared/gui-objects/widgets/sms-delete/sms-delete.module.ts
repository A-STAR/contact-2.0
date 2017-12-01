import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsDeleteService } from './sms-delete.service';

import { DialogActionModule } from '../../../components/dialog-action/dialog-action.module';
import { SmsDeleteDialogComponent } from './sms-delete.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
  ],
  exports: [
    SmsDeleteDialogComponent,
  ],
  declarations: [
    SmsDeleteDialogComponent,
  ],
  providers: [
    SmsDeleteService,
  ]
})
export class SmsDeleteModule { }
