import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/primeng';
import { TranslateModule } from '@ngx-translate/core';

import { TimePickerComponent } from './timepicker.component';

@NgModule({
  imports: [
    CalendarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    TimePickerComponent
  ],
  declarations: [
    TimePickerComponent,
  ],
})
export class TimePickerModule { }
