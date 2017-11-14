import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtService } from '../../../core/debt/debt.service';
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

  constructor(
    private debtService: DebtService,
  ) {}

  get incomingCallButtonDisabled$(): Observable<boolean> {
    return this.debtService.canRegisterIncomingCalls$;
  }

  get officeVisitButtonDisabled$(): Observable<boolean> {
    return this.debtService.canRegisterOfficeVisit$;
  }

  onRegisterIncomingCall(): void {

  }

  onRegisterVisit(): void {

  }
}
