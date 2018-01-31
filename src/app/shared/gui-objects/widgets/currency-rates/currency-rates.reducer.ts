import {
    IActionType,
    ICurrencyAction,
    ICurrencyState
} from './currency-rates.interface';

export const defaultState: ICurrencyState = {
    currencyId: null,
};

export function reducer(state: ICurrencyState = defaultState, action: ICurrencyAction): ICurrencyState {
    switch (action.type) {
        case IActionType.SELECT_CURRENCY:
            return {
                ...state,
                currencyId: action.payload.currencyId
            };
        default:
            return state;
    }
}
