import {
  ChangeDetectionStrategy, Component, EventEmitter, Output, Input
} from '@angular/core';

@Component({
  selector: 'app-schedule-log-view-dialog',
  templateUrl: './schedule-log-view-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLogViewDialogComponent {
  @Input() eventId: number;

  @Output() close = new EventEmitter<null>();

  onClose(): void {
    this.close.emit();
  }
}
