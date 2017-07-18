import { Response } from '@angular/http';

export class ResponseError {
  constructor(
    private _response: Response,
    private _action: string = null
  ) {}

  get status(): number {
    return this._response.status;
  }

  get message(): string {
    try {
      return this._response.json().message.code;
    } catch (error) {
      return null;
    }
  }

  get action(): string {
    return this._action;
  }
}
