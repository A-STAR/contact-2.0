import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IncomingCallService } from './incoming-call.service';

@Component({
  selector: 'app-incoming-call',
  templateUrl: 'incoming-call.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    IncomingCallService,
  ]
})
export class IncomingCallComponent {
  static COMPONENT_NAME = 'IncomingCallComponent';
}
