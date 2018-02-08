import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { DatePickerComponent } from './datepicker.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    DatePickerComponent,
  ],
  exports: [
    DatePickerComponent,
  ]
})
export class DatePickerModule {}
