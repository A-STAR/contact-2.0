import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-datetime',
  templateUrl: './datetime.component.html'
})
export class DateTimeComponent {}
