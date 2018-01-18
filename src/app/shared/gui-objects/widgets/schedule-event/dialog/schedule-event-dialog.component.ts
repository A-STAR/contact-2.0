import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';

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

  get canSubmit(): boolean {
    return this.card && this.card.canSubmit;
  }

  onSubmit(): void {
    this.close.emit(true);
  }

  onClose(): void {
    this.close.emit();
  }
}
