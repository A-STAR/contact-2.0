import { Injectable, ErrorHandler } from '@angular/core';
import { Response } from '@angular/http';

import { NotificationsService } from '../notifications/notifications.service';

import { AppError } from './app-error';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private notificationsService: NotificationsService) {}

  handleError(error: Error | Response | AppError): void {
    const appError = this.getAppError(error);
    this.notificationsService.error({ message: appError.message, param: {} });
    console.error(error);
  }

  private getAppError(error: Error | Response | AppError): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Response) {
      const { code } = error.json().message;
      const message = `errors.${error.status}.${code}`;
      return new AppError(message);
    }

    return new AppError('errors.default');
  }
}
