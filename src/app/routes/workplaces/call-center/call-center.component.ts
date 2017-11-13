import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

  constructor(
    private callCenterService: CallCenterService,
  ) {}

  get shouldSelectCampaign$(): Observable<boolean> {
    return this.callCenterService.shouldSelectCampaign$;
  }
}
