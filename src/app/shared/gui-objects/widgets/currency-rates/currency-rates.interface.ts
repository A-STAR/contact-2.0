export interface ICurrencyRate {
  id?: number;
  fromDateTime: string | Date;
  rate: number;
}

export enum IActionType {
  SELECT_CURRENCY = 'SELECT_CURRENCY',
}

export interface ICurrencySelectAction {
  type: IActionType.SELECT_CURRENCY;
  payload: {
      currencyId: number;
  };
}


export type ICurrencyAction =
  ICurrencySelectAction;

export interface ICurrencyState {
  currencyId: number;
}
