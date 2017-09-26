import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AttributeGridEditComponent } from './attribute-grid-edit.component';
import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    AttributeGridEditComponent,
  ],
  declarations: [
    AttributeGridEditComponent,
  ],
  entryComponents: [
    AttributeGridEditComponent,
  ]
})
export class AttributeGridEditModule { }
