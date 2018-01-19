import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IScheduleEvent } from '@app/shared/gui-objects/widgets/schedule-event/schedule-event.interface';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent extends DialogFunctions {

  dialog;

  onAdd(event: IScheduleEvent): void {
    this.setDialog('schedule');
  }
}
