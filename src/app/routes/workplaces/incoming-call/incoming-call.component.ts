import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-incoming-call',
  templateUrl: 'incoming-call.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomingCallComponent {
  static COMPONENT_NAME = 'IncomingCallComponent';
}
