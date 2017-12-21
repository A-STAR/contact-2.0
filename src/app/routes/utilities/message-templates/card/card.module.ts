import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../shared/components/dialog/dialog.module';
import { DropdownInputModule } from '../../../../shared/components/form/dropdown/dropdown-input.module';
import { DynamicFormModule } from '../../../../shared/components/form/dynamic-form/dynamic-form.module';
import { ListModule } from '../../../../shared/components/list/list.module';

import { MessageTemplateGridEditComponent } from './card.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DropdownInputModule,
    DynamicFormModule,
    ListModule,
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
