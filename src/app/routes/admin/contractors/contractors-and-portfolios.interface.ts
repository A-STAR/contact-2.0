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

export type PortfolioAction = 'sendOutsource' | 'sendCession' | 'returnOutsource';

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

export enum IActionType {
  CONTRACTORS_FETCH                      = 'CONTRACTORS_FETCH',
  CONTRACTOR_FETCH                       = 'CONTRACTOR_FETCH',
  CONTRACTOR_CREATE                      = 'CONTRACTOR_CREATE',
  CONTRACTOR_EDIT                        = 'CONTRACTOR_EDIT',
  CONTRACTOR_SELECT                      = 'CONTRACTOR_SELECT',
  CONTRACTOR_SAVE                        = 'CONTRACTOR_SAVE',
  CONTRACTOR_DELETE                      = 'CONTRACTOR_DELETE',

  MANAGERS_FETCH                         = 'MANAGERS_FETCH',
  MANAGER_FETCH                          = 'MANAGER_FETCH',
  MANAGERS_CLEAR                         = 'MANAGERS_CLEAR',
  MANAGER_EDIT                           = 'MANAGER_EDIT',
  MANAGER_SELECT                         = 'MANAGER_SELECT',
  MANAGER_CREATE                         = 'MANAGER_CREATE',
  MANAGER_SAVE                           = 'MANAGER_SAVE',
  MANAGER_DELETE                         = 'MANAGER_DELETE',

  PORTFOLIO_EDIT                         = 'PORTFOLIO_EDIT',
  PORTFOLIO_SELECT                       = 'PORTFOLIO_SELECT',
  PORTFOLIO_CREATE                       = 'PORTFOLIO_CREATE',
  PORTFOLIO_SAVE                         = 'PORTFOLIO_SAVE',
  PORTFOLIO_MOVE                         = 'PORTFOLIO_MOVE',
  PORTFOLIO_DELETE                       = 'PORTFOLIO_DELETE'
}

export interface IContractorSelectAction {
  type: IActionType.CONTRACTOR_SELECT;
  payload: {
    selectedContractor: IContractor;
  };
}

export interface IContractorSaveAction {
  type: IActionType.CONTRACTOR_SAVE;
  payload: {};
}

export interface IManagersFetchAction {
  type: IActionType.MANAGERS_FETCH;
  payload: {};
}

export interface IManagerSaveAction {
  type: IActionType.MANAGER_SAVE;
  payload: {};
}

export interface IManagerEditAction {
  type: IActionType.MANAGER_EDIT;
  payload: {
    selectedManager: IContractorManager;
  };
}

export interface IPortfolioSaveAction {
  type: IActionType.PORTFOLIO_SAVE;
  payload: {};
}

export interface IPortfolioSelectAction {
  type: IActionType.PORTFOLIO_SELECT;
  payload: {
    selectedContractor: IContractor;
    selectedPortfolio: IPortfolio;
  };
}

export interface IManagerSelectAction {
  type: IActionType.MANAGER_SELECT;
  payload: {
    selectedManager: IContractorManager;
  };
}

export type IContractorAndPorfolioAction =
  IContractorSelectAction |
  IContractorSaveAction |
  IManagersFetchAction |
  IManagerSaveAction |
  IManagerSelectAction |
  IManagerEditAction |
  IPortfolioSaveAction |
  IPortfolioSelectAction;

export interface IContractorsAndPortfoliosState {
  selectedManager: IContractorManager;
  selectedContractor: IContractor;
  selectedPortfolio: IPortfolio;
}
