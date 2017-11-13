import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICampaign } from './call-center.interface';

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

  get campaigns$(): Observable<ICampaign[]> {
    return this.callCenterService.campaigns$;
  }
}
