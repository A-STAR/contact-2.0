import { Action } from '@ngrx/store';

import { IAddressGridState } from './address-grid.interface';

import { AddressGridService } from './address-grid.service';

const defaultState: IAddressGridState = {
  addresses: []
};

export function addressGridReducer(state: IAddressGridState = defaultState, action: Action): IAddressGridState {
  switch (action.type) {
    case AddressGridService.ADDRESS_GRID_FETCH_SUCCESS:
      const { addresses } = action.payload;
      return { ...state, addresses };
    default:
      return state;
  }
};
