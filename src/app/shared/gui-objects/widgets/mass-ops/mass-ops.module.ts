import { NgModule } from '@angular/core';

import { AttributesModule } from './attributes/attributes.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { OutsourcingModule } from './outsourcing/outsourcing.module';

@NgModule({
  imports: [
    AttributesModule,
    EmailModule,
    SmsModule,
    OutsourcingModule,
  ],
  exports: [
    AttributesModule,
    EmailModule,
    SmsModule,
    OutsourcingModule,
  ],
})
export class MassOpsModule { }
