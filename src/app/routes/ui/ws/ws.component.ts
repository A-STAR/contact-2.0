import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-ws',
  templateUrl: './ws.component.html'
})
export class WSComponent {}
