import { Injectable } from '@angular/core';

import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { IActionGridDialogFilterParams, IGridActionPayload,  } from '../action-grid.interface';
import { MetadataActionType } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class ActionGridFilterService {

  constructor() { }

  buildRequest(actionData: IGridActionPayload): any {
    if (actionData.type === MetadataActionType.ALL) {
      return {
        ...actionData.data,
        ...this.getFilters((actionData.data as IActionGridDialogFilterParams).filtering)
      };
    }

    if (actionData.type === MetadataActionType.SINGLE) {
      return actionData.data;
    }

    return {
      ids: actionData.data
    };
  }

  getSelection(action: IAGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row, i) => {
      return [...acc, [...action.metadataAction.params.map(param => row[param])] ];
    }, []);
  }

  getSingleSelection(action: IAGridAction, selection: any): { [key: string]: any } {
    return action.metadataAction.params.reduce((acc, param) => ({ ...acc, [param]: selection[param] }), {});
  }

  private getFilters(filters?: FilterObject): any {
    return {
      filtering: filters && (filters.hasFilter() || filters.hasValues()) ? filters : null
    };
  }


}
