import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SelectModule } from '../../select/select.module';

import { DynamicFormComponent } from './dynamic-form.component';
import { DatePickerModule } from '../datepicker/datepicker.module';

@NgModule({
  imports: [
    CommonModule,
    DatePickerModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
  ],
  exports: [
    DynamicFormComponent
  ],
  declarations: [
    DynamicFormComponent,
  ],
  providers: [],
})
export class DynamicFormModule { }
