import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { EmailCardComponent } from './email-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    EmailCardComponent,
  ],
  declarations: [
    EmailCardComponent,
  ],
  entryComponents: [
    EmailCardComponent,
  ]
})
export class EmailCardModule { }
