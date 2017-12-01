export interface IContractor {
  id: number;
  name: string;
  fullName: string;
  smsName: string;
  responsibleFirstName?: string;
  responsibleLastName?: string;
  responsibleMiddleName?: string;
  responsibleFullName?: string;
  typeCode: number;
  phone: string;
  address: string;
  comment: string;
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

export interface IPortfolioMoveRequest {
  newContractorId: number;
}

export interface IPortfolioOutsourceRequest {
  debtStatusCode: number;
}

export interface IContractorManager {
  id: number;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  genderCode: number;
  position: string;
  branchCode: number;
  mobPhone: string;
  workPhone: string;
  intPhone: string;
  workAddress: string;
  comment: string;
}

export interface IContractorsAndPortfoliosState {
  selectedContractorId: number;
  selectedPortfolioId: number;
  selectedManagerId: number;
}
