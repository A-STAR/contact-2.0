import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person',
  styleUrls: [ 'select-person.component.scss' ],
  templateUrl: 'select-person.component.html'
})
export class SelectPersonComponent {}
