import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { IScheduleEvent } from '@app/shared/gui-objects/widgets/schedule-event/schedule-event.interface';

import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {

  constructor(
    private router: Router,
    private routingService: RoutingService
  ) { }

  onAdd(event: IScheduleEvent): void {
    this.routingService.navigate([ `${this.router.url}/create` ]);
  }
}
