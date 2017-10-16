import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePickerModule } from '../datepicker/datepicker.module';
import { SelectModule } from '../select/select.module';

import { ValueInputComponent } from './value.component';

@NgModule({
  imports: [
    CommonModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  exports: [
    ValueInputComponent,
  ],
  declarations: [
    ValueInputComponent,
  ],
})
export class ValueInputModule { }
