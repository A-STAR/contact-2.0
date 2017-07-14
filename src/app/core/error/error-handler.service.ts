import { Injectable, ErrorHandler } from '@angular/core';
import { Response } from '@angular/http';

import { NotificationsService } from '../notifications/notifications.service';

import { ResponseError } from './response-error';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private notificationsService: NotificationsService) {}

  handleError(error: Error | Response | ResponseError): void {
    if (error instanceof ResponseError) {
      this.notificationsService.error(`errors.default.${error.translationKey}.${error.status}`);
    }
    console.error(error);
  }
}
