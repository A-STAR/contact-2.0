import { NgModule } from '@angular/core';

import { SmsService } from './sms.service';

import { SmsComponent } from './sms.component';

@NgModule({
  exports: [
    SmsComponent,
  ],
  declarations: [
    SmsComponent,
  ],
  providers: [
    SmsService,
  ],
})
export class SmsModule {}
