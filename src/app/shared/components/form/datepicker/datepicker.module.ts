import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/primeng';
import { TextMaskModule } from 'angular2-text-mask';
import { TranslateModule } from '@ngx-translate/core';

import { DatePickerComponent } from './datepicker.component';

@NgModule({
  imports: [
    CalendarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    TranslateModule,
  ],
  exports: [
    DatePickerComponent
  ],
  declarations: [
    DatePickerComponent,
  ],
})
export class DatePickerModule { }
