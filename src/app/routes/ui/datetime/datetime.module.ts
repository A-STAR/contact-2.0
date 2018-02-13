import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { DatePickerModule } from './datepicker/datepicker.module';
import { DateTimePickerModule } from './datetimepicker/datetimepicker.module';
import { TimePickerModule } from './timepicker/timepicker.module';

import { DateTimeComponent } from './datetime.component';

const routes: Routes = [
  {
    path: '',
    component: DateTimeComponent,
  },
];

@NgModule({
  imports: [
    DatePickerModule,
    DateTimePickerModule,
    FormsModule,
    RouterModule.forChild(routes),
    TimePickerModule,
  ],
  declarations: [
    DateTimeComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class DateTimeModule {}
