import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';

import { MessageTemplateGridEditComponent } from './message-template-grid-edit.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    MessageTemplateGridEditComponent,
  ],
  declarations: [
    MessageTemplateGridEditComponent,
  ],
  entryComponents: [
    MessageTemplateGridEditComponent,
  ]
})
export class MessageTemplateGridEditModule { }
