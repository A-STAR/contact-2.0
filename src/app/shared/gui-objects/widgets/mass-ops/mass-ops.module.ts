import { NgModule } from '@angular/core';

import { AttributesModule } from './attributes/attributes.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';

@NgModule({
  imports: [
    AttributesModule,
    EmailModule,
    SmsModule,
  ],
  exports: [
    AttributesModule,
    EmailModule,
    SmsModule,
  ],
})
export class MassOpsModule { }
