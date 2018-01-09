import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { SmsService } from './sms.service';

import { SmsComponent } from './sms.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
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
