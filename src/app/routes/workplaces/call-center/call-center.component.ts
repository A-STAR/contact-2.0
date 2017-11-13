import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CallCenterService } from './call-center.service';

@Component({
  selector: 'app-call-center',
  templateUrl: 'call-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CallCenterService,
  ]
})
export class CallCenterComponent {
  static COMPONENT_NAME = 'CallCenterComponent';
}
