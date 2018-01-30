import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { EntityGroupGridModule } from '@app/shared/gui-objects/widgets/entity-group/grid/entity-group-grid.module';
import { GridModule } from '@app/shared/components/grid/grid.module';
import { ScheduleLogViewGridModule } from '@app/routes/utilities/schedule/dialog/grid/schedule-log-view-grid.module';

import { ScheduleLogViewDialogComponent } from '@app/routes/utilities/schedule/dialog/schedule-log-view-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
    GridModule,
    TranslateModule,
    EntityGroupGridModule,
    ScheduleLogViewGridModule
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
