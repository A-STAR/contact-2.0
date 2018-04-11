import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person',
  templateUrl: 'select-person.component.html'
})
export class SelectPersonComponent {}
