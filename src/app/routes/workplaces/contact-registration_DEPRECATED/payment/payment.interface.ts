export interface IPayment {
  amount: number;
  currencyId: number;
  date: string;
}

export interface IPaymentFormData {
  amount: number;
  date: Date;
  percentage: number;
}
