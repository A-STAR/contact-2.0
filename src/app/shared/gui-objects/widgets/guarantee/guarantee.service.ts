import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IGuaranteeContract } from './guarantee.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class GuaranteeService {
  static MESSAGE_GUARANTOR_SAVED = 'MESSAGE_GUARANTOR_SAVED';
  static MESSAGE_GUARANTEE_CONTRACT_SAVED = 'MESSAGE_GUARANTEE_CONTRACT_SAVED';

  private url = '/debts/{debtId}/guaranteeContract';
  private errSingular = 'entities.guaranteeContract.gen.singular';

  private contracts$ = new Subject<IGuaranteeContract[]>();

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  fetchAll(debtId: number): Observable<IGuaranteeContract[]> {
    return this.dataService
      .readAll(this.url, { debtId })
      .do(contracts => this.contracts$.next(contracts))
      .catch(this.notificationsService.fetchError().entity('entities.guaranteeContract.gen.plural').dispatchCallback());
  }

  // TODO: fetch one item form server
  fetch(debtId: number, contractId: number, personId: number = null): Observable<IGuaranteeContract> {
    return this.contracts$.map(contracts => contracts.find(
      contract => contract.contractId === contractId && (!personId || contract.personId === personId))
    );
  }

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

  notify(type: string): void {
    this.store.dispatch({ type });
  }
}
