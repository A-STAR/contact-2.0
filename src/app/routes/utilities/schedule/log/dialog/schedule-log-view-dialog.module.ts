import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridModule } from '@app/shared/components/grid/grid.module';
import { ScheduleLogViewGridModule } from '@app/routes/utilities/schedule/log/dialog/grid/schedule-log-view-grid.module';

import { ScheduleLogViewDialogComponent } from '@app/routes/utilities/schedule/log/dialog/schedule-log-view-dialog.component';

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    GridModule,
    TranslateModule,
    ScheduleLogViewGridModule,
  ],
  exports: [
    ScheduleLogViewDialogComponent,
  ],
  declarations: [
    ScheduleLogViewDialogComponent,
  ],
  entryComponents: [
    ScheduleLogViewDialogComponent,
  ]
})
export class ScheduleLogViewDialogModule { }
