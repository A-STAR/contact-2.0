import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { TimePickerComponent } from './timepicker.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    TimePickerComponent,
  ],
  exports: [
    TimePickerComponent,
  ]
})
export class TimePickerModule {}
