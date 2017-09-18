import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from '../datepicker/datepicker.module';
import { DropdownInputModule } from '../dropdown/dropdown-input.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';
import { PasswordModule } from '../password/password.module';
import { PopupInputModule } from '../popup-input/popup-input.module';
import { RadioGroupModule } from '../radio-group/radio-group.module';
import { RichTextEditorModule } from '../rich-text-editor/rich-text-editor.module';
import { SelectModule } from '../select/select.module';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormGroupComponent } from './group/dynamic-form-group.component';
import { DynamicFormFieldComponent } from './field/dynamic-form-field.component';

@NgModule({
  imports: [
    CommonModule,
    DatePickerModule,
    DropdownInputModule,
    FileUploadModule,
    ImageUploadModule,
    PasswordModule,
    PopupInputModule,
    RadioGroupModule,
    ReactiveFormsModule,
    RichTextEditorModule,
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
