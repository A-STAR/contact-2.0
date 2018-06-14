import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { first, map } from 'rxjs/operators';

import { ICall } from '@app/core/calls/call.interface';

import { CallService } from '@app/core/calls/call.service';
import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';

@Injectable()
export class DebtAction {

  readonly calls$ = new Subject<ICall[]>();

  readonly registerPhoneContact$ = new Subject<any>();

  constructor(
    private callService: CallService,
    private massOperationsService: MassOperationsService
  ) { }

  execute(actionData: any): void {
    const { phoneId } = actionData;
    this.massOperationsService.openDebtCard(actionData, () => {
      this.registerPhoneContact$.next(actionData);
      this.calls$
        .pipe(
          first(),
          map(calls => calls.find(c => c.phoneId === phoneId))
        )
        .subscribe(call => this.callService.setCall(call));
    });
  }
}
