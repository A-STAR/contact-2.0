import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, ViewChild, ChangeDetectorRef } from '@angular/core';

import { ScheduleEventService } from '../schedule-event.service';

import { ScheduleEventCardComponent } from '../card/schedule-event-card.component';

@Component({
  selector: 'app-schedule-event-dialog',
  templateUrl: './schedule-event-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEventDialogComponent {

  @Input() eventId: number;

  @Output() close = new EventEmitter<boolean>();

  @ViewChild(ScheduleEventCardComponent) card: ScheduleEventCardComponent;

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
  ) {}

  get canSubmit(): boolean {
    return this.card && this.card.canSubmit;
  }

  onSubmit(): void {
    debugger
    const action = this.eventId
      ? this.scheduleEventService.update(this.eventId, this.card.eventSerializedUpdates)
      : this.scheduleEventService.create(this.card.eventSerializedUpdates);

    action.subscribe(() => {
      this.scheduleEventService.dispatchAction(ScheduleEventService.MESSAGE_SCHEDULE_EVENT_SAVED);
      this.close.emit(true);
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
