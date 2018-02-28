import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { SchedulePeriodCardComponent } from './schedule-period-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SchedulePeriodCardComponent,
  ],
  declarations: [
    SchedulePeriodCardComponent,
  ],
})
export class SchedulePeriodCardModule {}
