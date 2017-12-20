import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/observable/combineLatest';

import { IAppState } from '../../../../core/state/state.interface';
import { IGroup } from './group.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserConstantsService } from 'app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class GroupService extends AbstractActionService {
  static MESSAGE_GROUP_SAVED = 'MESSAGE_GROUP_SAVED';

  private baseUrl = '/groups';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userDictionariesService: UserDictionariesService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('GROUP_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('GROUP_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('GROUP_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('GROUP_DELETE');
  }

  get canConditionEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('GROUP_CONDITION_EDIT');
  }

  get groupEntityTypeOptions$(): Observable<IOption[]> {
    return Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ENTITY_TYPE),
      this.userConstantsService.get('Group.EntityType.List').map(constant => constant.valueS)
    ).map(([ options, groupEntityTypeCodes ]) =>
      groupEntityTypeCodes === 'ALL'
        ? options
        : options.filter(option => groupEntityTypeCodes.split(',').map(Number).includes(<number>option.value))
    );
  }

  fetchAll(forCurrentUser: boolean): Observable<Array<IGroup>> {
    return this.dataService.readAll(`${this.baseUrl}?forCurrentUser=${forCurrentUser ? 1 : 0}`)
      .catch(this.notificationsService.fetchError().entity('entities.group.gen.plural').dispatchCallback());
  }

  fetch(groupId: number): Observable<IGroup> {
    return this.dataService.read(`${this.baseUrl}/{groupId}`, { groupId })
      .catch(this.notificationsService.fetchError().entity('entities.group.gen.singular').dispatchCallback());
  }

  create(group: IGroup): Observable<IGroup> {
    return this.dataService.create(this.baseUrl, {}, group)
      .catch(this.notificationsService.createError().entity('entities.group.gen.singular').dispatchCallback());
  }

  update(groupId: number, group: IGroup): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{groupId}`, { groupId }, group)
      .catch(this.notificationsService.updateError().entity('entities.group.gen.singular').dispatchCallback());
  }

  delete(groupId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{groupId}`, { groupId })
      .catch(this.notificationsService.deleteError().entity('entities.group.gen.singular').dispatchCallback());
  }
}