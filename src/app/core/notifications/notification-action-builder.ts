import { HttpResponseBase } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

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
  private _response: HttpResponseBase;
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

  response(response: HttpResponseBase): NotificationActionBuilder {
    this._response = response;
    return this;
  }

  entity(entity: string): NotificationActionBuilder {
    this._params.entity = entity;
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

  callback(): (response: HttpResponseBase) => Array<UnsafeAction> {
    return (response: HttpResponseBase) => [ this.response(response).action() ];
  }

  dispatchCallback(): (response: HttpResponseBase) => Observable<null> {
    return (response: HttpResponseBase) => {
      this.response(response).dispatch();
      return Observable.throw(response);
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
      const { status } = message.response;

      const json = this.parseMessageResponse(message);

      if (json && json.message) {
        const { code, payload } = json.message;
        const payloadParams = payload ? payload.reduce((acc, param, i) => { acc[`$${i + 1}`] = param; return acc; }, {}) : {};

        const translatedMessageKey = `errors.server.${code}`;
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

  private parseMessageResponse(message: IMessageOptions): any {
    try {
      return JSON.parse(message.response.statusText);
    } catch (e) {
      return null;
    }
  }

  private createAction(type: INotificationActionType, payload?: INotificationActionPayload): UnsafeAction {
    return {
      type,
      payload
    };
  }
}
