import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule-tab',
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEditComponent {

  constructor(
    private route: ActivatedRoute,
  ) {}

  get eventId(): number {
    return Number(this.route.snapshot.paramMap.get('eventId'));
  }
}
