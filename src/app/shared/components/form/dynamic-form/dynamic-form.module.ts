import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CheckModule } from '../check/check.module';
import { ColorPickerModule } from '../colorpicker/colorpicker.module';
import { DateTimeModule } from '../datetime/datetime.module';
import { DebtAmountModule } from '../debt-amount/debt-amount.module';
import { DialogMultiSelectModule } from '../dialog-multi-select/dialog-multi-select.module';
import { DropdownInputModule } from '../dropdown/dropdown-input.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { TitlebarModule } from '../../titlebar/titlebar.module';
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
    CheckModule,
    ColorPickerModule,
    CommonModule,
    DateTimeModule,
    DebtAmountModule,
    DialogMultiSelectModule,
    DropdownInputModule,
    FileUploadModule,
    TitlebarModule,
    HtmlTextareaModule,
    ImageUploadModule,
    MultiLanguageModule,
    PasswordModule,
    PopupInputModule,
    RadioGroupModule,
    ReactiveFormsModule,
    SegmentedInputModule,
    SelectModule,
    TextEditorModule,
    TranslateModule,
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
export class DynamicFormModule {}
