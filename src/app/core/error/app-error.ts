export class AppError {
  constructor(
    private _message: string,
    private _params: object = {},
  ) {}

  get message(): string {
    return this._message;
  }

  get params(): object {
    return this._params;
  };
}
