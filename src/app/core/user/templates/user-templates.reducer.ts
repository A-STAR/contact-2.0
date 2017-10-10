import { Action } from '@ngrx/store';

import { IUserTemplatesState, TemplateStatusEnum } from './user-templates.interface';

import { UserTemplatesService } from './user-templates.service';

const defaultState: IUserTemplatesState = {
  templates: null
};

export function userTemplatesReducer(state: IUserTemplatesState = defaultState, action: Action): IUserTemplatesState {
  switch (action.type) {
    case UserTemplatesService.USER_TEMPLATES_FETCH: {
      const { typeCode, recipientTypeCode } = action.payload;
      const key = `${typeCode}/${recipientTypeCode}`;
      return {
        ...state,
        templates: {
          ...state.templates,
          [key]: {
            status: TemplateStatusEnum.PENDING,
            templates: state.templates && state.templates[key] ? state.templates[key].templates : [],
          },
        }
      };
    }
    case UserTemplatesService.USER_TEMPLATES_FETCH_SUCCESS: {
      const { typeCode, recipientTypeCode, templates } = action.payload;
      const key = `${typeCode}/${recipientTypeCode}`;
      return {
        ...state,
        templates: {
          ...state.templates,
          [key]: {
            status: TemplateStatusEnum.LOADED,
            templates,
          },
        }
      };
    }
    case UserTemplatesService.USER_TEMPLATES_FETCH_FAILURE: {
      const { typeCode, recipientTypeCode } = action.payload;
      const key = `${typeCode}/${recipientTypeCode}`;
      return {
        ...state,
        templates: {
          ...state.templates,
          [key]: {
            status: TemplateStatusEnum.ERROR,
            templates: state.templates && state.templates[key] ? state.templates[key].templates : [],
          }
        }
      }
    }
    default:
      return state;
  }
};
