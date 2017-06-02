import { Action } from '@ngrx/store';

import { IOrganizationsState } from './organizations.interface';

import { OrganizationsService } from './organizations.service';

const defaultState: IOrganizationsState = {
  data: [],
  selectedOrganizationId: null
};

export function organizationsReducer(state: IOrganizationsState = defaultState, action: Action): IOrganizationsState {
  switch (action.type) {
    case OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload.organizations
      };
    case OrganizationsService.ORGANIZATIONS_SELECT:
      return {
        ...state,
        selectedOrganizationId: action.payload.id
      };
    case OrganizationsService.ORGANIZATIONS_CLEAR:
      return {
        ...state,
        data: []
      };
    default:
      return state;
  }
};
