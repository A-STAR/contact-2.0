import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { ScheduleEventCardModule } from '../card/schedule-event-card.module';

import { ScheduleEventDialogComponent } from './schedule-event-dialog.component';
import { ScheduleEventDialogStartComponent } from './schedule-event-dialog-start.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    TranslateModule,
    ScheduleEventCardModule,
  ],
  exports: [
    ScheduleEventDialogComponent,
  ],
  declarations: [
    ScheduleEventDialogComponent,
    ScheduleEventDialogStartComponent,
  ],
  entryComponents: [
    ScheduleEventDialogComponent,
  ]
})
export class ScheduleEventDialogModule { }
