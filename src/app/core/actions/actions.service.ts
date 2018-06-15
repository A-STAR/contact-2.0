import { Injectable } from '@angular/core';

import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';
import { PhoneService } from '@app/routes/workplaces/core/phone/phone.service';
import { PBXStateEnum } from '@app/core/calls/call.interface';

@Injectable()
export class ActionsService {

  constructor(
    private massOperationsService: MassOperationsService,
    private phoneService: PhoneService,
  ) { }

  doAction(actionData: any): void {
    this.openDebtCard(actionData);
  }

  openDebtCard(actionData: any): void {
    const { debtId, phoneId, lineStatus, callTypeCode } = actionData;
    if (debtId && phoneId && lineStatus === PBXStateEnum.PBX_CALL && callTypeCode === 1) {
      this.massOperationsService.openDebtCard(actionData, () => {
        this.phoneService.registerContact(debtId, phoneId);
        this.phoneService.setCall(debtId, phoneId);
      });
    }
  }
}
