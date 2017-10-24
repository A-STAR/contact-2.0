export interface IPayment {
  id?: number;
  amount: number;
  amountMainCurrency?: number;
  comment?: string;
  currencyName?: string;
  currencyId: number;
  commission?: number;
  isCanceled?: number;
  isConfirmed?: number;
  payerName?: string;
  paymentDateTime: Date | string;
  purposeCode?: number;
  receiptNumber?: string;
  receiveDateTime?: Date | string;
  reqUserFullName?: string;
  reqUserId?: number;
  statusCode?: number;
  userFullName?: string;
}
