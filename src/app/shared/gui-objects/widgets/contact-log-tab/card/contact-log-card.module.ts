import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { ContactLogTabCardComponent } from './contact-log-card.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    TranslateModule,
    DynamicFormModule
  ],
  exports: [
   ContactLogTabCardComponent,
  ],
  declarations: [
   ContactLogTabCardComponent,
  ],
  entryComponents: [
   ContactLogTabCardComponent,
  ]
})
export class ContactLogCardModule { }
