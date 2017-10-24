import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { DocumentCardComponent } from './document-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    DocumentCardComponent,
  ],
  declarations: [
    DocumentCardComponent,
  ],
  entryComponents: [
    DocumentCardComponent,
  ]
})
export class DocumentCardModule { }
