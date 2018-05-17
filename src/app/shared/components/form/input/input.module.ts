import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';

import { NumberComponent } from './number/number.component';
import { PasswordComponent } from './password/password.component';
import { RangeComponent } from './range/range.component';
import { SegmentedInputComponent } from './segmented-input/segmented-input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { TextComponent } from './text/text.component';

import { MaskedArrayDirective } from './masked-array/masked-array.directive';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    NumberComponent,
    PasswordComponent,
    RangeComponent,
    SegmentedInputComponent,
    TextareaComponent,
    TextComponent,
    MaskedArrayDirective
  ],
  declarations: [
    NumberComponent,
    PasswordComponent,
    RangeComponent,
    SegmentedInputComponent,
    TextareaComponent,
    TextComponent,
    MaskedArrayDirective,
  ],
})
export class InputModule {}
