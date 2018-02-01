import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IAppState } from '../../../../core/state/state.interface';
import {
  IScheduleEvent, IScheduleGroup, IScheduleType,
  IScheduleParam, IScheduleStartRequest, IScheduleUser, IScheduleEventLog
} from './schedule-event.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';
import { IUserDictionaryOptions } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';
import { TranslateService } from '@ngx-translate/core';

import { toOption } from '@app/core/utils';

@Injectable()
export class ScheduleEventService extends AbstractActionService {
  static MESSAGE_SCHEDULE_EVENT_SAVED = 'MESSAGE_SCHEDULE_EVENT_SAVED';

  private baseUrl = '/scheduleEvent';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userDictionaryService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private userTemplatesService: UserTemplatesService,
    private translateService: TranslateService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_VIEW');
  }

  get canViewLog$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_LOG_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_DELETE');
  }

  get canStart$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_MANUAL_EXECUTE');
  }

  get dictionaries$(): Observable<IUserDictionaryOptions> {
    return this.userDictionaryService.getDictionariesAsOptions([
      UserDictionariesService.DICTIONARY_PHONE_TYPE,
      UserDictionariesService.DICTIONARY_EMAIL_TYPE,
      UserDictionariesService.DICTIONARY_PERSON_ROLE,
    ]);
  }

  get constants$(): Observable<IUserConstant[]> {
    return combineLatest(
      this.userConstantsService.get('SMS.Sender.Use'),
      this.userConstantsService.get('Email.Sender.Use'),
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('Email.Sender.Default'),
    );
  }

  get weekDays(): { [dayControl: string]: string } {
    return this.translateService.instant('default.date.days.full')
      .reduce((acc, day, i, days) => ({ ...acc, [`weekDays${i}`]: days[(i + 1) % 7] }), {});
  }

  get monthDays(): { [dayControl: string]: string } {
    return Array.from(new Array(32), (v, i) => String(++i))
      .reduce((acc, day, i) => ({ ...acc, [`monthDays${i}`]: day }), {});
  }

  fetchAll(): Observable<IScheduleEvent[]> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.scheduleEvents.gen.plural').dispatchCallback());
  }

  fetch(eventId: number): Observable<IScheduleEvent> {
    return this.dataService.read(`${this.baseUrl}/{eventId}`, { eventId })
      .catch(this.notificationsService.fetchError().entity('entities.scheduleEvents.gen.singular').dispatchCallback());
  }

  create(event: IScheduleEvent): Observable<IScheduleEvent> {
    return this.dataService.create(this.baseUrl, {}, event)
      .catch(this.notificationsService.createError().entity('entities.scheduleEvents.gen.singular').dispatchCallback());
  }

  update(eventId: number, event: IScheduleEvent): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{eventId}`, { eventId }, event)
      .catch(this.notificationsService.updateError().entity('entities.scheduleEvents.gen.singular').dispatchCallback());
  }

  fetchGroups(): Observable<IScheduleGroup[]> {
    return this.dataService
      .readAll('/filters/groups', {}, {})
      .catch(this.notificationsService.fetchError().entity('entities.groups.gen.plural').dispatchCallback());
  }

  fetchUsers(): Observable<IScheduleUser[]> {
    return this.dataService
      .readAll('/filters/users', {}, {})
      .catch(this.notificationsService.fetchError().entity('entities.users.gen.plural').dispatchCallback());
  }

  fetchLogs(eventId: number): Observable<IScheduleEventLog[]> {
    return this.dataService.readAll(`${this.baseUrl}/{eventId}/executionLogs`, { eventId })
      .catch(this.notificationsService.fetchError().entity('entities.scheduleEventLog.gen.singular').dispatchCallback());
  }

  delete(eventId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{eventId}`, { eventId })
    .catch(this.notificationsService.deleteError().entity('entities.scheduleEvents.gen.singular').dispatchCallback());
  }

  start(eventIds: number[], data: IScheduleStartRequest): Observable<any> {
    return this.dataService.create(`${this.baseUrl}/start?ids={eventIds}`, { eventIds: eventIds.join() }, data)
    .catch(this.notificationsService.error('widgets.scheduleEvents.errors.start')
      .params({ eventId: eventIds.join() }).dispatchCallback());
  }

  getEventAddParamValue(param: IScheduleParam): any {
    switch (param.name) {
      case 'personRoles':
      case 'phoneTypes':
        return param.value.split(',');
      default:
        return +param.value || param.value;
    }
  }

  createEventAddParam(name: string, value: any): IScheduleParam {
    switch (name) {
      case 'personRoles':
      case 'phoneTypes':
        return { name, value: value.join(',') };
      default:
        return { name, value };
    }
  }

  getEventTemplateOptions(typeCode: number, addParams: IScheduleParam[]): Observable<IOption[]> {
    const personRoles = this.findEventAddParam<number[]>(addParams, 'personRoles') || [];
    return this.userTemplatesService
      .getTemplates(typeCode, personRoles.length === 1 ? personRoles[0] : 0)
      .map(templates => templates.map(toOption('id', 'name')));
  }

  getEventAddParams(scheduleType: IScheduleType): any {
    return (scheduleType.additionalParameters || [])
      .reduce((acc, param) => ({ ...acc, [param.name]: this.getEventAddParamValue(param) }), {});
  }

  findEventAddParam<T>(addParams: IScheduleParam[], name: string): T {
    const param = (addParams || []).find(p => p.name === name);
    return param && this.getEventAddParamValue(param) as any;
  }

  createEventAddParams(params: any): IScheduleParam[] {
    return Object.keys(params)
      .filter(key => key !== 'checkGroup')
      .filter(key => key !== 'groupId')
      .map(key => this.createEventAddParam(key, params[key]));
  }

  getGroupsByEntityType(groups: IScheduleGroup[]): { [type: number]: IScheduleGroup[] } {
    return groups.reduce((acc, group) => ({
      ...acc,
      [group.entityTypeId]: [ ...(acc[group.entityTypeId] || []), group ]
    }), {});
  }
}
