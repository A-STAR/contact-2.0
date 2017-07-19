import { Injectable, ErrorHandler } from '@angular/core';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private notificationsService: NotificationsService) {}

  handleError(error: Error): void {
    console.error(error);
  }
}
