import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../../state/state.interface';
import { IUserTemplate, IUserTemplates, TemplateStatusEnum } from './user-templates.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

@Injectable()
export class UserTemplatesService {
  static USER_TEMPLATES_FETCH         = 'USER_TEMPLATES_FETCH';
  static USER_TEMPLATES_FETCH_SUCCESS = 'USER_TEMPLATES_FETCH_SUCCESS';
  static USER_TEMPLATES_FETCH_FAILURE = 'USER_TEMPLATES_FETCH_FAILURE';

  private templates: IUserTemplates;

  constructor(private store: Store<IAppState>) {
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

  getTemplates(typeCode: number, recipientTypeCode: number): Observable<IUserTemplate[]> {
    const key = `${typeCode}/${recipientTypeCode}`;
    const status = this.templates && this.templates[key] && this.templates[key].status;
    if (status !== TemplateStatusEnum.PENDING && status !== TemplateStatusEnum.LOADED) {
      this.refresh(typeCode, recipientTypeCode);
    }
    return this.templates$
      .map(state => state[key])
      .filter(slice => slice && slice.status === TemplateStatusEnum.LOADED)
      .map(slice => slice.templates)
      .distinctUntilChanged();
  }

  private get templates$(): Observable<IUserTemplates> {
    return this.store.select(state => state.userTemplates.templates);
  }
}
