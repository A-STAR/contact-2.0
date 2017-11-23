import { Actions } from '@ngrx/effects';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IPledgeContract, IPledgeContractInformation, IContractInformation,
  IContractProperty, IContractPledgor } from './pledge.interface';
import { UnsafeAction } from '../../../../core/state/state.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class PledgeService {
  static MESSAGE_PLEDGE_CONTRACT_SAVED = 'MESSAGE_PLEDGE_CONTRACT_SAVED';
  static MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED = 'MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED';

  private baseUrl = '/debts/{debtId}/pledgeContract';
  private errSingular = 'entities.pledgeContract.gen.singular';

  private contracts$ = new Subject<IPledgeContract[]>();

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    private store: Store<IAppState>,
  ) {}

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_DELETE');
  }

  fetchAll(debtId: number): Observable<Array<IPledgeContract>> {
    return this.dataService
      .readAll(this.baseUrl, { debtId })
      .do(contracts => this.contracts$.next(contracts))
      .catch(this.notificationsService.fetchError().entity('entities.pledgeContract.gen.plural').dispatchCallback());
  }

  // TODO: fetch one item form server
  fetch(debtId: number, contractId: number, personId: number = null, propertyId: number = null): Observable<IPledgeContract> {
    return this.contracts$.map(contracts => contracts.find(contract => contract.contractId === contractId
      && (!personId || contract.personId === personId) && (!propertyId || contract.propertyId === propertyId)));
  }

  createPledgeContractInformation(contract: IPledgeContract): IPledgeContractInformation {
    return {
      contractNumber: contract.contractNumber,
      contractStartDate: contract.contractStartDate,
      contractEndDate: contract.contractEndDate,
      comment: contract.comment,
      pledgors: [{
        personId: contract.personId,
        properties: [{
          propertyId: contract.propertyId,
          pledgeValue: contract.pledgeValue,
          marketValue: contract.marketValue,
          currencyId: contract.currencyId
        }]
      }]
    };
  }

  createContractPledgor(pledgorId: number, property: IContractProperty): IContractPledgor {
    return {
      personId: pledgorId,
      properties: [{
        propertyId: property.propertyId,
        pledgeValue: property.pledgeValue,
        marketValue: property.marketValue,
        currencyId: property.currencyId
      }]
    };
  }

  addPledgor(debtId: number, contractId: number, pledgor: IContractPledgor): Observable<any> {
    return this.dataService
      .create(`${this.baseUrl}/{contractId}/pledgor`, { debtId, contractId }, pledgor)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  updateProperty(debtId: number, contractId: number, pledgorId: number,
    propertyId: number, property: IContractProperty): Observable<any> {
    return this.dataService
      .update(
        `${this.baseUrl}/{contractId}/pledgor/{pledgorId}/property/{propertyId}`,
        { debtId, contractId, pledgorId, propertyId },
        property
      ).catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  create(debtId: number, contract: IPledgeContractInformation): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { debtId }, contract)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  update(debtId: number, contractId: number, pledgorId: number, propertyId: number,
    contract: IContractInformation, property: IContractProperty): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{contractId}`, { debtId, contractId }, contract).concatMap(
      () => this.updateProperty(debtId, contractId, pledgorId, propertyId, property)
    ).catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  delete(debtId: number, contractId: number, pledgorId: number, propertyId: number): Observable<any> {
    return this.dataService
      .delete(
        `${this.baseUrl}/{contractId}/pledgor/{pledgorId}/property/{propertyId}`,
        { debtId, contractId, pledgorId, propertyId }
      ).catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }

  notify(type: string, payload?: any): void {
    this.store.dispatch({ type, payload });
  }

  select<T = any>(type: string): Observable<T> {
    return this.actions.ofType(type)
      .map(action => (action as UnsafeAction).payload);
  }
}
