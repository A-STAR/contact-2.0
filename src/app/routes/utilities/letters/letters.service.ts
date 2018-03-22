import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { ILetterTemplate } from './letters.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class LettersService extends AbstractActionService {
  static MESSAGE_LETTER_TEMPLATE_SAVED = 'MESSAGE_LETTER_TEMPLATE_SAVED';

  private baseUrl = '/letters/templates';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(): Observable<Array<ILetterTemplate>> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.letters.gen.plural').dispatchCallback());
  }

  fetch(templateId: number): Observable<ILetterTemplate> {
    return this.dataService.read(`${this.baseUrl}/{templateId}`, { templateId })
      .catch(this.notificationsService.fetchError().entity('entities.letters.gen.singular').dispatchCallback());
  }

  create(template: ILetterTemplate): Observable<ILetterTemplate> {
    return this.dataService.create(this.baseUrl, {}, template)
      .catch(this.notificationsService.createError().entity('entities.letters.gen.singular').dispatchCallback());
  }

  update(templateId: number, template: ILetterTemplate): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{templateId}`, { templateId }, template)
      .catch(this.notificationsService.updateError().entity('entities.letters.gen.singular').dispatchCallback());
  }

  delete(templateId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{templateId}`, { templateId })
      .catch(this.notificationsService.deleteError().entity('entities.letters.gen.singular').dispatchCallback());
  }
}
