import { NgModule } from '@angular/core';

import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';

@NgModule({
  imports: [
    EmailModule,
    SmsModule,
  ],
  exports: [
    EmailModule,
    SmsModule,
  ],
})
export class MassOpsModule { }
