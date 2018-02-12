import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { DateTimePickerComponent } from './datetimepicker.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    DateTimePickerComponent,
  ],
  exports: [
    DateTimePickerComponent,
  ]
})
export class DateTimePickerModule {}
