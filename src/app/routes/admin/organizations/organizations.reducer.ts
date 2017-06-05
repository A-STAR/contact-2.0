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
    selectedUserId: null
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
    case OrganizationsService.EMPLOYEES_CLEAR:
      return {
        ...state,
        employees: {
          ...state.employees,
          data: []
        }
      };
    default:
      return state;
  }
};
