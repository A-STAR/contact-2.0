import { Injectable } from '@angular/core';
import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { MetadataActionType } from '@app/core/metadata/metadata.interface';
import { IGridActionPayload, IActionGridDialogFilterParams } from '../action-grid.interface';
import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';

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

    return {
      ids: actionData.data
    };
  }

  getSelection(action: IAGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row, i) => {
      return [...acc, [...action.metadataAction.params.map(param => row[param])] ];
    }, []);
  }

  private getFilters(filters?: FilterObject): any {
    return {
      filtering: filters && (filters.hasFilter() || filters.hasValues()) ? filters : null
    };
  }


}
