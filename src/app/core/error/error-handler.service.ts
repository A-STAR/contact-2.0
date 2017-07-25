import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor() {}

  handleError(error: Error): void {
    console.error(error);
  }
}
