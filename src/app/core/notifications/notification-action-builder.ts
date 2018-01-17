import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import {
  IMessageOptions,
  IMessageParams,
  INotificationActionType,
  INotificationActionPayload,
  NotificationTypeEnum
} from './notifications.interface';

export class NotificationActionBuilder {
  private _prefix: string;
  private _response: object;
  private _params: IMessageParams = {};
  private _alert = true;

  constructor(
    private store: Store<IAppState>,
    private translateService: TranslateService,
    private _type: NotificationTypeEnum,
    private _text: string = null
  ) {}

  prefix(prefix: string): NotificationActionBuilder {
    this._prefix = prefix;
    return this;
  }

  response(response: object): NotificationActionBuilder {
    this._response = response;
    return this;
  }

  entity(entity: string): NotificationActionBuilder {
    this._params.entity = entity;
    return this;
  }

  context(context: string): NotificationActionBuilder {
    this._params.context = context;
    return this;
  }

  params(params: IMessageParams): NotificationActionBuilder {
    this._params = params;
    return this;
  }

  noAlert(): NotificationActionBuilder {
    this._alert = false;
    return this;
  }

  action(): UnsafeAction {
    const messageOptions = {
      text: this._text,
      prefix: this._prefix,
      response: this._response,
      params: this._params,
      alert: this._alert
    };

    return this.createAction('NOTIFICATION_PUSH', {
      notification: {
        type: this._type,
        message: this.translateMessage(messageOptions),
        created: new Date(),
        showAlert: this._alert
      }
    });
  }

  dispatch(): void {
    this.store.dispatch(this.action());
  }

  callback(): (response: object) => Array<UnsafeAction> {
    return (response: object) => [ this.response(response).action() ];
  }

  dispatchCallback(): (response: object) => Observable<null> {
    return (response: object) => {
      this.response(response).dispatch();
      return ErrorObservable.create(response);
    };
  }

  private translateMessage(message: string | IMessageOptions): string {
    if (message instanceof String) {
      return this.translateService.instant(message);
    }

    const translatedParams = Object.keys(message.params || {}).reduce((acc, key) => {
      acc[key] = this.translateService.instant(message.params[key]);
      return acc;
    }, {});

    if (message.response) {
      const { response } = message;
      const status = response instanceof HttpErrorResponse ? response.status : null;
      const responseBody = response instanceof HttpErrorResponse ? response.error : response;

      if (responseBody && responseBody.message) {
        const { code, payload } = responseBody.message;
        const payloadParams = payload
          ? payload.reduce((acc, param, i) => { acc[`$${i + 1}`] = this.translatePayloadParam(param); return acc; }, {})
          : {};
        const translatedMessageKey = `errors.server.${code}`;
        const translatedMessage = this.translateService.instant(translatedMessageKey, payloadParams);
        if (translatedMessage !== translatedMessageKey) {
          return translatedMessage;
        }
      } else if (responseBody && responseBody.massInfo) {
        const { massInfo } = responseBody;
        const payloadParams = massInfo || {};
        const translatedMessageKey = message.params.entity;
        const translatedMessage = this.translateService.instant(translatedMessageKey, payloadParams);
        if (translatedMessage !== translatedMessageKey) {
          return translatedMessage;
        }
      }

      const translatedFallbackMessageKey = `${message.text}.${status}`;
      const translatedFallbackMessage = this.translateService.instant(translatedFallbackMessageKey, translatedParams);
      if (translatedFallbackMessage !== translatedFallbackMessageKey) {
        return translatedFallbackMessage;
      }

      const translatedGenericMessageKey = `${message.text}.*`;
      const translatedGenericMessage = this.translateService.instant(translatedGenericMessageKey, translatedParams);
      if (translatedGenericMessage !== translatedGenericMessageKey) {
        return translatedGenericMessage;
      }
    }

    return this.translateService.instant(message.text, translatedParams);
  }

  private translatePayloadParam(param: string): string {
    const translationKey = `${this._params.context}.${param}`;
    const translatedPayloadField = this.translateService.instant(translationKey);
    return translationKey !== translatedPayloadField ? translatedPayloadField : param;
  }

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): UnsafeAction {
    return {
      type,
      payload
    };
  }
}
