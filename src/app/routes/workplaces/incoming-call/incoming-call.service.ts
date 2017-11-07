import { Injectable } from '@angular/core';

@Injectable()
export class IncomingCallService {
  changeSelectedDebtorId(debtorId: number): void {
    console.log(`changeSelectedDebtorId(${debtorId})`);
  }
}
