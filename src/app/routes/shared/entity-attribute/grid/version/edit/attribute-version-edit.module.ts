import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { AttributeVersionEditComponent } from './attribute-version-edit.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
  declarations: [AttributeVersionEditComponent],
  exports: [AttributeVersionEditComponent]
})
export class AttributeVersionEditModule { }
