export interface IDashboardParams {
  debtActiveCnt: number;
  debtNeedCallCnt: number;
  monthPaymentCnt: number;
  monthPaymentAmount: number;
  monthPaymentCommission: number;
}

export interface IDashboardPromiseAmount {
  promiseDateList: string[];
  promiseAmountList: number[];
}

export interface IDashboardPromiseCount {
  promiseDateList: string[];
  promiseAmountList: number[];
}

export interface IDashboardPromiseCountStatus {
  monthPromiseFulfilled: number;
  monthPromiseOverdue: number;
  monthPromiseWaiting: number;
}

export interface IDashboardPromiseCoverage {
  monthPromiseAmountCover: number;
  monthPromiseAmountRest: number;
}

export interface IDashboardContactsDay {
  debtorSuccessContact: number;
  guarantorSuccessContact: number;
  pledgorSuccessContact: number;
  thirdPersonSuccessContact: number;
  debtorSuccessContactPlan: number;
}



