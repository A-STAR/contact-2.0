import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';

import { CapitalizeModule } from '@app/shared/pipes/capitalize/capitalize.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { MomentModule } from '@app/shared/pipes/moment/moment.module';

import { DateTimePickerComponent } from './datetimepicker/datetimepicker.component';
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
    CapitalizeModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    MomentModule,
    TextMaskModule,
  ]
})
export class DateTimeModule {}
