import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from '../datepicker/datepicker.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';
import { SelectModule } from '../select/select.module';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormGroupComponent } from './group/dynamic-form-group.component';
import { DynamicFormFieldComponent } from './field/dynamic-form-field.component';

@NgModule({
  imports: [
    CommonModule,
    DatePickerModule,
    ImageUploadModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
  ],
  exports: [
    DynamicFormComponent,
    DynamicFormGroupComponent,
    DynamicFormFieldComponent,
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormGroupComponent,
    DynamicFormFieldComponent,
  ],
  providers: [],
})
export class DynamicFormModule { }
