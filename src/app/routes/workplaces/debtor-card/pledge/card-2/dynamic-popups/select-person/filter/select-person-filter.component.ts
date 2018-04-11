import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person-filter',
  templateUrl: 'select-person-filter.component.html'
})
export class SelectPersonFilterComponent {}
