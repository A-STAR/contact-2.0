import { Injectable } from '@angular/core';

import {
  IGridActionFilterParams,
  IGridActionParams,
  IGridActionPayload,
  ISelectionIds,
} from '../action-grid.interface';
import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { MetadataActionType } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class ActionGridFilterService {

  constructor() { }

  buildRequest(actionData: IGridActionPayload): any {
    if (actionData.type === MetadataActionType.ALL) {
      return {
        ...actionData.data,
        ...this.getFilters((actionData.data as IGridActionFilterParams).filtering)
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

  getSelectionCount(actionData: IGridActionPayload): number | null {
    return actionData.type === MetadataActionType.SELECTED ? (actionData as ISelectionIds).data.length : null;
  }

  getAddOptions(action: IGridActionParams, name: string): (number|string)[] {
    // TODO(d.maltsev): not optimized; better to convert to key: value object on initialization
    // TODO(i.lobanov): why store it that way in json config?
    const found = action.addOptions.find(option => option.name === name);
    return found ? found.value : null;
  }

  getAddOption(action: IGridActionParams, name: string, index: number): number|string {
    const options = this.getAddOptions(action, name);
    if (options && options.length > index) {
      return options[index];
    }
  }

  private getFilters(filters?: FilterObject): { filtering: FilterObject | null } {
    return {
      filtering: filters && (filters.hasFilter() || filters.hasValues()) ? filters : null
    };
  }


}
