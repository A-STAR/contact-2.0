import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { ContactLogCardComponent } from './contact-log-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule
  ],
  exports: [
   ContactLogCardComponent,
  ],
  declarations: [
   ContactLogCardComponent,
  ],
  entryComponents: [
   ContactLogCardComponent,
  ]
})
export class ContactLogCardModule { }
