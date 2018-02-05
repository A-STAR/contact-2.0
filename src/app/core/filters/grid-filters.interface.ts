export interface IFilterPortfolio {
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

export interface IFilterDictionary {
  code: number;
  name: string;
  children?: any;
}

export interface IFilterUser {
  id: number;
  lastName: string;
  firstName: string;
  fullName: string;
  middleName: string;
  position: string;
  organization: string;
  isInactive: number;
}

export interface IFilterGroup {
  id:	number;
  name:	string;
  entityTypeId: number;
  isManual: number;
  comment: string;
}

export interface IFilterContractor {
  id: number;
  name: string;
  fullName: string;
  typeCode: number;
  comment: string;
}

