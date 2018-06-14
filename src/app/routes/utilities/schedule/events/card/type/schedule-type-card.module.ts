import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomOperationParamsModule } from '@app/shared/mass-ops/custom-operation/params/custom-operation-params.module';
import { SharedModule } from '../../../../../../shared/shared.module';

import { ScheduleTypeCardComponent } from './schedule-type-card.component';

@NgModule({
  imports: [
    CommonModule,
    CustomOperationParamsModule,
    SharedModule,
  ],
  exports: [
    ScheduleTypeCardComponent,
  ],
  declarations: [
    ScheduleTypeCardComponent,
  ],
  entryComponents: [
    ScheduleTypeCardComponent,
  ],
})
export class ScheduleTypeCardModule { }
