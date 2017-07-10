export interface IContractor {
  id: number;
  name: string;
  fullName: string;
  smsName: string;
  responsibleName: string;
  typeCode: number;
  phone: string;
  address: string;
  comment: string;
}

export interface IContractorsResponse {
  success: boolean;
  contractors: Array<IContractor>;
}

export interface IPortfolio {
  id: number;
  name: string;
  statusCode: number;
  stageCode: number;
  directionCode: number;
  signDate: string | Date;
  startWorkDate: string | Date;
  endWorkDate: string | Date;
  comment: string;
}

export interface IPortfoliosResponse {
  success: boolean;
  portfolios: Array<IPortfolio>;
}

export interface IContractorsAndPortfoliosState {
  contractors: Array<IContractor>;
  selectedContractorId: number;
  portfolios: Array<IPortfolio>;
  selectedPortfolioId: number;
}
