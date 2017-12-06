import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { AttributeVersionEditModule } from './edit/attribute-version-edit.module';

import { AttributeVersionComponent } from './attribute-version.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
    AttributeVersionEditModule
  ],
  declarations: [
    AttributeVersionComponent
  ],
  exports: [
    AttributeVersionComponent,
  ],
})
export class AttributeVersionModule { }
