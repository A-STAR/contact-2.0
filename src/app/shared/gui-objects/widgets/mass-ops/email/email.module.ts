import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { EmailService } from './email.service';

import { EmailComponent } from './email.component';

@NgModule({
  imports: [
    ButtonModule,
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
