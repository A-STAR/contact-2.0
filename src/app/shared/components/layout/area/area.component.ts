import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-area',
  templateUrl: 'name.component.html'
})
export class AreaComponent {}
