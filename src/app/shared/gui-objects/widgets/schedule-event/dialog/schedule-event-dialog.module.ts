import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';
import { ScheduleEventCardModule } from '../card/schedule-event-card.module';

import { ScheduleEventDialogComponent } from './schedule-event-dialog.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
    ScheduleEventCardModule,
  ],
  exports: [
    ScheduleEventDialogComponent
  ],
  declarations: [
    ScheduleEventDialogComponent
  ],
  entryComponents: [
    ScheduleEventDialogComponent,
  ]
})
export class ScheduleEventDialogModule { }