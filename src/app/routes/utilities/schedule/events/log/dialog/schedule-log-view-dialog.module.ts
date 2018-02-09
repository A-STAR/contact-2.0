import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridModule } from '@app/shared/components/grid/grid.module';
import { ScheduleLogViewGridModule } from './grid/schedule-log-view-grid.module';

import { ScheduleLogViewDialogComponent } from './schedule-log-view-dialog.component';

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
  ]
})
export class ScheduleLogViewDialogModule { }
