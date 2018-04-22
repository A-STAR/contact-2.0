import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { IAppState } from '@app/core/state/state.interface';
import { IGuaranteeContract } from './guarantee.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class GuaranteeService extends AbstractActionService {
  static MESSAGE_GUARANTOR_SAVED = 'MESSAGE_GUARANTOR_SAVED';
  static MESSAGE_GUARANTEE_CONTRACT_SAVED = 'MESSAGE_GUARANTEE_CONTRACT_SAVED';

  private url = '/debts/{debtId}/guaranteeContract';
  private errSingular = 'entities.guaranteeContract.gen.singular';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(debtId: number): Observable<IGuaranteeContract[]> {
    return this.dataService
      .readAll(this.url, { debtId })
      .catch(this.notificationsService.fetchError().entity('entities.guaranteeContract.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contractId: number): Observable<IGuaranteeContract> {
    return this.dataService
      .read(`${this.url}/{contractId}`, { debtId, contractId })
      .catch(this.notificationsService.fetchError().entity('entities.guaranteeContract.gen.singular').dispatchCallback());
  }

  // // TODO: fetch one item form server
  // fetch(_: number, contractId: number, personId: number = null): Observable<IGuaranteeContract> {
  //   return this.contracts$.map(contracts => contracts.find(
  //     contract => contract.contractId === contractId && (!personId || contract.personId === personId))
  //   );
  // }

  create(debtId: number, contract: IGuaranteeContract): Observable<any> {
    return this.dataService
      .create(this.url, { debtId }, contract)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  addGuarantor(debtId: number, contractId: number, personId: number): Observable<any> {
    return this.dataService
      .create(`${this.url}/{contractId}/guarantor`, { debtId, contractId }, { personId })
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  update(debtId: number, contractId: number, contract: IGuaranteeContract): Observable<any> {
    return this.dataService
      .update(`${this.url}/{contractId}`, { debtId, contractId }, contract)
      .catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  delete(debtId: number, contractId: number, personId: number): Observable<any> {
    return this.dataService
      .delete(`${this.url}/{contractId}/guarantor/{personId}`, { debtId, contractId, personId })
      .catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }
}
