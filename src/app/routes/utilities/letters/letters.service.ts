import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { ILetterTemplate } from './letters.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class LettersService extends AbstractActionService {
  static MESSAGE_LETTER_TEMPLATE_SAVED = 'MESSAGE_LETTER_TEMPLATE_SAVED';

  private baseUrl = '/letters/templates';

  readonly canView$ = this.userPermissionsService.has('LETTER_TEMPLATE_VIEW');
  readonly canAdd$ = this.userPermissionsService.has('LETTER_TEMPLATE_ADD');
  readonly canEdit$ = this.userPermissionsService.has('LETTER_TEMPLATE_EDIT');
  readonly canDelete$ = this.userPermissionsService.has('LETTER_TEMPLATE_DELETE');

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  fetchAll(): Observable<Array<ILetterTemplate>> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.letterTemplates.gen.plural').dispatchCallback());
  }

  fetch(templateId: number): Observable<ILetterTemplate> {
    return this.dataService.read(`${this.baseUrl}/{templateId}`, { templateId })
      .catch(this.notificationsService.fetchError().entity('entities.letterTemplates.gen.singular').dispatchCallback());
  }

  create(template: ILetterTemplate, file: File): Observable<ILetterTemplate> {
    return this.dataService.createMultipart(this.baseUrl, {}, template, file)
      .catch(this.notificationsService.createError().entity('entities.letterTemplates.gen.singular').dispatchCallback());
  }

  update(templateId: number, template: ILetterTemplate, file: File): Observable<any> {
    return this.dataService.updateMultipart(`${this.baseUrl}/{templateId}`, { templateId }, template, file)
      .catch(this.notificationsService.updateError().entity('entities.letterTemplates.gen.singular').dispatchCallback());
  }

  delete(templateId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{templateId}`, { templateId })
      .catch(this.notificationsService.deleteError().entity('entities.letterTemplates.gen.singular').dispatchCallback());
  }
}
