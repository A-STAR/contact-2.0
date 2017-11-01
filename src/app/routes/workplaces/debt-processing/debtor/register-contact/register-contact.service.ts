import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress } from '../../../../../shared/gui-objects/widgets/address/address.interface';
import { IDebt } from '../../debt-processing.interface';
import { IPhone } from '../../../../../shared/gui-objects/widgets/phone/phone.interface';

import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Injectable()
export class RegisterContactService {
  constructor(
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canRegisterContacts$(): Observable<boolean> {
    return this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [ 1, 3, 7, 8 ]);
  }

  get canRegisterPhones$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 1);
  }

  canRegisterPhone$(phone: IPhone, debt: IDebt): Observable<boolean> {
    return phone.isInactive
      ? Observable.of(false)
      : combineLatestAnd([ this.canRegisterPhones$, this.canRegisterDebt$(debt) ]);
  }

  get canRegisterAddresses$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 3);
  }

  canRegisterAddress$(address: IAddress, debt: IDebt): Observable<boolean> {
    return address.isInactive
      ? Observable.of(false)
      : combineLatestAnd([ this.canRegisterAddresses$, this.canRegisterDebt$(debt) ]);
  }

  get canRegisterMisc$(): Observable<boolean> {
    return this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [ 7, 8 ]);
  }

  private canRegisterDebt$(debt: IDebt): Observable<boolean> {
    return this.isDebtActive(debt)
      ? Observable.of(true)
      : this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG');
  }

  private isDebtActive(debt: IDebt): boolean {
    return ![6, 7, 8, 17].includes(debt.statusCode);
  }
}
