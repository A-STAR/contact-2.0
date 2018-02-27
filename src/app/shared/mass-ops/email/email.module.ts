import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { EmailService } from './email.service';

import { EmailComponent } from './email.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    EmailComponent,
  ],
  declarations: [
    EmailComponent,
  ],
  providers: [
    EmailService,
  ],
})
export class EmailModule {}
