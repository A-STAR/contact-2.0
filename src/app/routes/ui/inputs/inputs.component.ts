import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-inputs',
  templateUrl: './inputs.component.html'
})
export class InputsComponent {}
