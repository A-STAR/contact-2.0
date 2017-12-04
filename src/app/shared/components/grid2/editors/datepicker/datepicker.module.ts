import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';

import { DatePickerModule as FormDatePickerModule } from '../../../form/datepicker/datepicker.module';

import { DatePickerComponent } from './datepicker.component';

@NgModule({
  declarations: [
    DatePickerComponent,
  ],
  entryComponents: [
    DatePickerComponent,
  ],
  exports: [
    DatePickerComponent,
  ],
  imports: [
    CalendarModule,
    FormsModule,
    FormDatePickerModule,
  ],
})
export class DatePickerModule { }
