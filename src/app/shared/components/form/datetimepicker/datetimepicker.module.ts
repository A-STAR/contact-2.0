import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DateTimePickerComponent } from './datetimepicker.component';
import { DateComponent } from './date/date.component';
import { TimeComponent } from './time/time.component';

@NgModule({
  declarations: [
    DateTimePickerComponent,
    DateComponent,
    TimeComponent,
  ],
  exports: [
    DateTimePickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class DateTimePickerModule {}
