import { Action } from '@ngrx/store';

import { IOrganizationsState } from './organizations.interface';

import { OrganizationsService } from './organizations.service';

const defaultState: IOrganizationsState = {
  organizations: {
    data: [],
    selectedId: null
  },
  employees: {
    data: [],
    selectedUserId: null,
    add: {
      data: []
    }
  },
  dialogAction: null
};

export function organizationsReducer(state: IOrganizationsState = defaultState, action: Action): IOrganizationsState {
  switch (action.type) {
    case OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS:
      return {
        ...state,
        organizations: {
          ...state.organizations,
          data: action.payload.organizations
        }
      };
    case OrganizationsService.ORGANIZATION_SELECT:
      return {
        ...state,
        organizations: {
          ...state.organizations,
          selectedId: action.payload.organizationId
        }
      };
    case OrganizationsService.ORGANIZATIONS_CLEAR:
      return {
        ...state,
        organizations: {
          ...state.organizations,
          data: []
        }
      };
    case OrganizationsService.EMPLOYEES_FETCH_SUCCESS:
      return {
        ...state,
        employees: {
          ...state.employees,
          data: action.payload.employees
        }
      };
    case OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED_SUCCESS:
      return {
        ...state,
        employees: {
          ...state.employees,
          add: {
            ...state.employees.add,
            data: action.payload.employees
          }
        }
      };
    case OrganizationsService.EMPLOYEE_SELECT:
      return {
        ...state,
        employees: {
          ...state.employees,
          selectedUserId: action.payload.employeeUserId
        }
      };
    case OrganizationsService.EMPLOYEES_CLEAR:
      return {
        ...state,
        employees: {
          ...state.employees,
          data: []
        }
      };
    case OrganizationsService.DIALOG_ACTION:
      return {
        ...state,
        dialogAction: action.payload.dialogAction
      };
    default:
      return state;
  }
};
