import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';

import { DateTimeModule } from '../../../form/datetime/datetime.module';

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
    DateTimeModule,
  ],
})
export class DatePickerModule {}
