import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { ScheduleEditComponent } from './edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ScheduleEditComponent
  ],
  declarations: [
    ScheduleEditComponent
  ],
})
export class ScheduleEditModule {}
