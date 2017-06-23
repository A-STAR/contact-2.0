import { Injectable, ErrorHandler } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: any): void {
    if (environment.production) {
      // TODO(d.maltsev): production error handling
    } else {
      this.consoleHandler(error);
    }
  }

  private consoleHandler(error: any): void {
    console.error(error);
  }
}
