import { IOrganizationsAction, IOrganizationsState } from './organizations.interface';

const defaultState: IOrganizationsState = {
  organizations: [],
  employees: []
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function organizationsReducer(state: IOrganizationsState = defaultState, action: IOrganizationsAction): IOrganizationsState {
  switch (action.type) {
    default:
      return state;
  }
};
