import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CalendarModule } from 'primeng/primeng';

import { DatePickerComponent } from './../datepicker/datepicker.component';

@NgModule({
  imports: [
    CalendarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
  ],
  exports: [
    DatePickerComponent
  ],
  declarations: [
    DatePickerComponent,
  ],
  providers: [],
})
export class DatePickerModule { }
