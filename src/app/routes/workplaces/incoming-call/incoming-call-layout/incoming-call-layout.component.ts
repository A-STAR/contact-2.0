import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-incoming-call-layout',
  templateUrl: 'incoming-call-layout.component.html',
})
export class IncomingCallLayoutComponent {}
