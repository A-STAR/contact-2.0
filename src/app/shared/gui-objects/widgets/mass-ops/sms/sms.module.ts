import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { SmsService } from './sms.service';

import { SmsComponent } from './sms.component';

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
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
