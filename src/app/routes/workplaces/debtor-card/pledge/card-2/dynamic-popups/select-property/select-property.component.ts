import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-property',
  templateUrl: 'select-property.component.html'
})
export class SelectPropertyComponent {}
