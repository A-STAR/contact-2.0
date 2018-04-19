export interface IMetadataFormState {
  value: any;
}

export enum MetadataFormAction {
  UPDATE_VALUE = '[form] update value',
}

export interface IMetadataFormUpdateValueAction {
  type: MetadataFormAction.UPDATE_VALUE;
  key: string;
  payload: {
    value: any;
  };
}

export type IMetadataFormAction = IMetadataFormUpdateValueAction;

const initialState: IMetadataFormState = {
  value: {},
};

export function createMetadataFormReducer(key: string): any {
  return (state = initialState, action: IMetadataFormAction): IMetadataFormState => {
    if (action.key === key) {
      switch (action.type) {
        case MetadataFormAction.UPDATE_VALUE:
          return {
            ...state,
            value: action.payload.value,
          };
      }
    }
    return state;
  };
}
