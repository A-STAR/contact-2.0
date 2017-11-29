import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsDeleteDialogModule } from './dialog/sms-delete-dialog.module';

import { SmsDeleteService } from './sms-delete.service';

@NgModule({
  imports: [
    CommonModule,
    SmsDeleteDialogModule,
  ],
  exports: [
    SmsDeleteDialogModule
  ],
  providers: [
    SmsDeleteService,
  ]
})
export class SmsDeleteModule { }
