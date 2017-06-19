import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from '../datepicker/datepicker.module';
import { FormImageModule } from '../image/image.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';
import { SelectModule } from '../select/select.module';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormGroupComponent } from './group/dynamic-form-group.component';


@NgModule({
  imports: [
    CommonModule,
    DatePickerModule,
    FormImageModule,
    ImageUploadModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
  ],
  exports: [
    DynamicFormComponent,
    DynamicFormGroupComponent,
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormGroupComponent,
  ],
  providers: [],
})
export class DynamicFormModule { }
