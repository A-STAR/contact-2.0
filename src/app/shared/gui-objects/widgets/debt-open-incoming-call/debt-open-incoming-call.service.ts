import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDebtOpenIncomingCallData } from './debt-open-incoming.call.interface';

@Injectable()
export class DebtOpenIncomingCallService {

  constructor() { }

  data$ = new BehaviorSubject<IDebtOpenIncomingCallData>(null);

}
