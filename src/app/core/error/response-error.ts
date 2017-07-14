import { Response } from '@angular/http';

export class ResponseError {
  constructor(private _response: Response, private _translationKey: string) {}

  get status(): number {
    return this._response.status;
  }

  get translationKey(): string {
    return this._translationKey;
  }
}
