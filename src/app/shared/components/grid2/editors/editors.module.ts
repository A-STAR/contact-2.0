import { NgModule } from '@angular/core';

import { DatePickerModule } from './datepicker/datepicker.module';

@NgModule({
  imports: [
    DatePickerModule,
  ],
  exports: [
    DatePickerModule,
  ],
})
export class EditorsModule { }
