import { Actions } from '@ngrx/effects';
import { ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IAppState } from '@app/core/state/state.interface';
import { IGroup } from './groups.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { AuthService } from '@app/core/auth/auth.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class GroupsService extends AbstractActionService implements CanActivateChild {
  static MESSAGE_GROUP_SAVED = 'MESSAGE_GROUP_SAVED';

  private baseUrl = '/groups';

  constructor(
    protected actions: Actions,
    private authService: AuthService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  readonly canView$: Observable<boolean> = this.userPermissionsService.has('GROUP_VIEW');

  readonly canViewDebtGroup$: Observable<boolean> = this.userPermissionsService.has('GROUP_TAB_DEBT_GROUP');

  readonly canViewSchedule$: Observable<boolean> = this.userPermissionsService.has('SCHEDULE_VIEW');

  readonly canAdd$: Observable<boolean> = this.userPermissionsService.has('GROUP_ADD');

  readonly canConditionEdit$: Observable<boolean> = this.userPermissionsService.has('GROUP_CONDITION_EDIT');

  readonly groupEntityTypeOptions$: Observable<IOption[]> = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ENTITY_TYPE),
      this.userConstantsService.get('Group.EntityType.List').map(constant => constant.valueS)
    ).map(([ options, groupEntityTypeCodes ]) =>
      groupEntityTypeCodes === 'ALL'
        ? options
        : options.filter(option => groupEntityTypeCodes.split(/,\s*/).map(Number).includes(<number>option.value))
    );

  canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean> {
    let routePerm: Observable<boolean>;

    switch (childRoute.routeConfig.path) {
      case 'all':
        routePerm = this.canView$;
        break;
      case 'debts':
        routePerm = this.canViewDebtGroup$;
        break;
      case 'schedule':
        routePerm = this.canViewSchedule$;
        break;
      default:
        break;
    }

    return routePerm || of(true);
  }

  canEdit$(group: IGroup): Observable<boolean> {
    return combineLatest(
      this.userPermissionsService.has('GROUP_EDIT'),
      this.userPermissionsService.has('GROUP_WORK_ALL'),
      this.authService.currentUser$
    )
    .map(([ canEdit, canWorkAll, user ]) => canEdit && (user.userId === group.userId || canWorkAll));
  }

  canDelete$(group: IGroup): Observable<boolean> {
    return combineLatest(
      this.userPermissionsService.has('GROUP_DELETE'),
      this.userPermissionsService.has('GROUP_WORK_ALL'),
      this.authService.currentUser$
    )
    .map(([ canEdit, canWorkAll, user ]) => canEdit && (user.userId === group.userId || canWorkAll));
  }

  fetchAll(forCurrentUser: boolean): Observable<IGroup[]> {
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
