import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TextMaskModule } from 'angular2-text-mask';

import { CapitalizeModule } from '@app/shared/pipes/capitalize/capitalize.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { MomentModule } from '@app/shared/pipes/moment/moment.module';

import { DateTimeService } from './datetime.service';

import { DateComponent } from './date/date.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DateTimeInputComponent } from './input/input.component';
import { DateTimePickerComponent } from './datetimepicker/datetimepicker.component';
import { TimeComponent } from './time/time.component';
import { TimePickerComponent } from './timepicker/timepicker.component';

@NgModule({
  declarations: [
    DateComponent,
    DatePickerComponent,
    DateTimeInputComponent,
    DateTimePickerComponent,
    TimeComponent,
    TimePickerComponent,
  ],
  exports: [
    DateComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    TimeComponent,
    TimePickerComponent,
  ],
  imports: [
    CapitalizeModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    MomentModule,
    TextMaskModule,
    TranslateModule,
  ],
  providers: [
    DateTimeService,
  ],
})
export class DateTimeModule {}
