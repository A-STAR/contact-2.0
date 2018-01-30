import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ColorPickerModule } from '../colorpicker/colorpicker.module';
import { DatePickerModule } from '../datepicker/datepicker.module';
import { TimePickerModule } from '../timepicker/timepicker.module';
import { DebtAmountModule } from '../debt-amount/debt-amount.module';
import { DialogMultiSelectModule } from '../dialog-multi-select/dialog-multi-select.module';
import { DropdownInputModule } from '../dropdown/dropdown-input.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { FormToolbarModule } from '../titlebar/titlebar.module';
import { HtmlTextareaModule } from '../html-textarea/html-textarea.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';
import { MultiLanguageModule } from '../multi-language/multi-language.module';
import { PasswordModule } from '../password/password.module';
import { PopupInputModule } from '../popup-input/popup-input.module';
import { RadioGroupModule } from '../radio-group/radio-group.module';
import { SegmentedInputModule } from '../segmented-input/segmented-input.module';
import { SelectModule } from '../select/select.module';
import { TextEditorModule } from '../text-editor/text-editor.module';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormGroupComponent } from './group/dynamic-form-group.component';
import { DynamicFormFieldComponent } from './field/dynamic-form-field.component';

@NgModule({
  imports: [
    ColorPickerModule,
    CommonModule,
    DatePickerModule,
    DebtAmountModule,
    DialogMultiSelectModule,
    DropdownInputModule,
    FileUploadModule,
    FormToolbarModule,
    HtmlTextareaModule,
    ImageUploadModule,
    MultiLanguageModule,
    PasswordModule,
    PopupInputModule,
    RadioGroupModule,
    ReactiveFormsModule,
    TimePickerModule,
    TranslateModule,
    SegmentedInputModule,
    SelectModule,
    TextEditorModule,
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
