import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../state/state.interface';
import { IUserTemplate, IUserTemplates, TemplateStatusEnum } from './user-templates.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class UserTemplatesService {
  static USER_TEMPLATES_FETCH         = 'USER_TEMPLATES_FETCH';
  static USER_TEMPLATES_FETCH_SUCCESS = 'USER_TEMPLATES_FETCH_SUCCESS';
  static USER_TEMPLATES_FETCH_FAILURE = 'USER_TEMPLATES_FETCH_FAILURE';

  private templates: IUserTemplates;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {
    this.templates$.subscribe(templates => this.templates = templates);
  }

  createRefreshAction(typeCode: number, recipientTypeCode: number): UnsafeAction {
    return {
      type: UserTemplatesService.USER_TEMPLATES_FETCH,
      payload: {
        typeCode,
        recipientTypeCode,
      }
    };
  }

  refresh(typeCode: number, recipientTypeCode: number): void {
    const action = this.createRefreshAction(typeCode, recipientTypeCode);
    this.store.dispatch(action);
  }

  getTemplates(typeCode: number, recipientTypeCode: number, isSingleSending: boolean = false): Observable<IUserTemplate[]> {
    const key = `${typeCode}/${recipientTypeCode}`;
    const status = this.templates && this.templates[key] && this.templates[key].status;
    if (status !== TemplateStatusEnum.PENDING && status !== TemplateStatusEnum.LOADED) {
      this.refresh(typeCode, recipientTypeCode);
    }
    return this.templates$
      .map(state => state[key])
      .filter(slice => slice && slice.status === TemplateStatusEnum.LOADED)
      .map(slice => slice.templates.filter(template => !isSingleSending || template.isSingleSending))
      .distinctUntilChanged();
  }

  /**
   * Fetches evaluated template for given debt and person
   *
   * See http://confluence.luxbase.int:8090/display/WEB20/Debt+Template+Text
   *
   * @param debtId
   * @param personId
   * @param personRole
   * @param templateId
   * @param callCenter whether the request is coming from call center
   */
  fetchMessageTemplateText(
    debtId: number,
    personId: number,
    personRole: number,
    templateId: number,
    callCenter: boolean,
  ): Observable<string> {
    const url = '/debts/{debtId}/persons/{personId}/personRoles/{personRole}/templates/{templateId}';
    return this.dataService
      .read(url, { debtId, personId, personRole, templateId }, { params: { callCenter }})
      .catch(this.notificationsService.fetchError().entity('entities.messageTemplate.gen.plural').dispatchCallback())
      .map(response => response.text);
  }

  private get templates$(): Observable<IUserTemplates> {
    return this.store.select(state => state.userTemplates)
      .filter(Boolean)
      .map(state => state.templates);
  }
}
