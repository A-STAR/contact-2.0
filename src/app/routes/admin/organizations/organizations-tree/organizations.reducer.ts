import { IOrganizationsAction, IOrganizationsState } from './organizations.interface';

const defaultState: IOrganizationsState = {
  data: []
};

// This should NOT be an arrow function in order to pass AoT compilation
// See: https://github.com/ngrx/store/issues/190#issuecomment-252914335
export function organizationsReducer(state: IOrganizationsState = defaultState, action: IOrganizationsAction): IOrganizationsState {
  switch (action.type) {
    case 'ORGANIZATIONS_LOAD':
      return {
        ...state,
        organizations: [
          {
            id: 1,
            name: '111',
            comment: '111',
            branchCode: 111,
            boxColor: '#fff',
            sortOrder: 1
          }
        ]
      }
    default:
      return state;
  }
};
