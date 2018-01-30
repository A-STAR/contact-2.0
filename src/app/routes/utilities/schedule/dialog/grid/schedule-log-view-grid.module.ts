import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridModule } from '@app/shared/components/grid/grid.module';

import { ScheduleLogViewGridComponent } from '@app/routes/utilities/schedule/dialog/grid/schedule-log-view-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
    GridModule,
    TranslateModule,
  ],
  exports: [
    ScheduleLogViewGridComponent,
  ],
  declarations: [
    ScheduleLogViewGridComponent,
  ],
  entryComponents: [
    ScheduleLogViewGridComponent,
  ]
})
export class ScheduleLogViewGridModule { }
