import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DateTimeModule } from '@app/shared/components/form/datetime/datetime.module';

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
    FormsModule,
    DateTimeModule,
  ],
})
export class DatePickerModule {}
