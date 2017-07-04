import { Action } from '@ngrx/store';

import { IOrganizationsState } from './organizations.interface';

import { OrganizationsService } from './organizations.service';

const defaultState: IOrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  employees: [],
  notAddedEmployees: [],
  selectedEmployeeUserId: null,
  dialogAction: null
};

export function organizationsReducer(state: IOrganizationsState = defaultState, action: Action): IOrganizationsState {
  switch (action.type) {
    case OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS:
      return {
        ...state,
        organizations: action.payload.organizations
      };
    case OrganizationsService.ORGANIZATION_SELECT:
      return {
        ...state,
        selectedOrganization: action.payload.organization
      };
    case OrganizationsService.ORGANIZATIONS_CLEAR:
      return {
        ...state,
        organizations: [],
        selectedOrganization: null
      };
    case OrganizationsService.EMPLOYEES_FETCH_SUCCESS:
      return {
        ...state,
        employees: action.payload.employees
      };
    case OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED_SUCCESS:
      return {
        ...state,
        notAddedEmployees: action.payload.employees
      };
    case OrganizationsService.EMPLOYEE_SELECT:
      return {
        ...state,
        selectedEmployeeUserId: action.payload.employeeUserId
      };
    case OrganizationsService.EMPLOYEES_CLEAR:
      return {
        ...state,
        employees: [],
        selectedEmployeeUserId: null
      };
    case OrganizationsService.DIALOG_ACTION:
      return {
        ...state,
        dialogAction: action.payload.dialogAction,
        selectedOrganization: action.payload.organization === null
          ? null
          : action.payload.organization || state.selectedOrganization
      };
    default:
      return state;
  }
};
