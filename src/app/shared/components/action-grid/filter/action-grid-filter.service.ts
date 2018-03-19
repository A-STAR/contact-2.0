import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  IActionGridAction,
  IGridActionFilterSelection,
  IGridAction,
  IGridActionPayload,
  IGridActionSelection,
  IGridActionContext,
  ICloseAction,
} from '../action-grid.interface';

import { MetadataActionType } from '@app/core/metadata/metadata.interface';

import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class ActionGridFilterService {

  private actionPayloads = {
    [MetadataActionType.ALL]: this.getFilterPayload,
    [MetadataActionType.SELECTED]: this.getSelectionPayload,
    [MetadataActionType.SINGLE]: this.getSingleSelectionPayload,
  };

  cbActions: { [key: string]: (action: IGridAction) => any };

  // notify subscribers, that grid has filters
  hasFilter$ = new BehaviorSubject<boolean>(null);

  constructor(
    private massOpsService: MassOperationsService,
  ) {
    this.cbActions = this.createDlgActions();
  }

  buildRequest(actionData: IGridActionPayload): any {
    switch (actionData.type) {
      case MetadataActionType.ALL:
        return {
          ...actionData.data,
          filtering: this.getFilters((actionData.data as IGridActionFilterSelection).filtering)
        };
      case MetadataActionType.SELECTED:
        return {
          ids: actionData.data
        };
      case MetadataActionType.SINGLE:
      default:
        return actionData.data;
    }
  }

  getPayload(action: IActionGridAction, params?: IGridActionContext): IGridActionPayload {
    return (this.actionPayloads[action.metadataAction.type]
        || this.actionPayloads[MetadataActionType.SINGLE]).call(this, action, params);
  }

  /**
   * Returns selection from grid filtered by config params
   * and without undefined and null values.
   * NOTE: This method should be marked as private when action handle logic
   * is moved here from action grid cmp!
   * @param action
   * @param selected
   */
  getSelection(action: IActionGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row) => {
      return [
        ...acc,
        [...action.metadataAction.params
          .map(param => row[param])
          // filter null and undefined params
          .filter(value => value != null)
        ]
      ];
    }, []);
  }
  /**
   * Returns selection from grid filtered by config params.
   * NOTE: it returns also undefined or null values!
   * NOTE: This method should be marked as private when action handle logic
   * is moved here from action grid cmp!
   * @param action
   * @param selected
   */
  getGridSelection(action: IActionGridAction, selected: any[]): number[][] {
    return selected.reduce((acc, row) => {
      return [
        ...acc,
        [...action.metadataAction.params
          .map(param => row[param])
        ]
      ];
    }, []);
  }

  getSelectionCount(actionData: IGridActionPayload): number | null {
    return actionData.type === MetadataActionType.SELECTED ? (actionData.data as IGridActionSelection).length : null;
  }

  getAddOptions(action: IGridAction, name: string): (number|string)[] {
    // TODO(d.maltsev): not optimized; better to convert to key: value object on initialization
    // TODO(i.lobanov): why store it that way in json config?
    const found = action.addOptions.find(option => option.name === name);
    return found ? found.value : null;
  }

  getAddOption(action: IGridAction, name: string, index: number): number|string {
    const options = this.getAddOptions(action, name);
    if (options && options.length > index) {
      return options[index];
    }
  }

  getSelectionPayload(action: IActionGridAction, params: IGridActionContext): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: this.getSelection(action, params.selection)
    };
  }

  getFilterPayload(action: IActionGridAction, params: IGridActionContext): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: {
        filtering: this.getFilters(params.filters),
        gridName: params.metadataKey,
        columnNames: action.metadataAction.params
      }
    };
  }

  getSingleSelectionPayload(action: IActionGridAction): IGridActionPayload {
    return {
      type: action.metadataAction.type,
      data: this.getSingleSelection(action, action.selection)
    };
  }


  isFilterAction(actionData: IGridActionPayload): boolean {
    return actionData.type === MetadataActionType.ALL;
  }

  private createDlgActions(): { [key: string]: (action: IGridAction) => any } {
    return Object.keys(this.massOpsService.nonDlgActions).reduce((acc, actionName) => ({
      ...acc,
      [actionName]: (actionData: any, close: EventEmitter<ICloseAction>) =>
        this.massOpsService.nonDlgActions[actionName](this.buildRequest(actionData.payload), close)
    }), {});
  }

  private getSingleSelection(action: IActionGridAction, selection: any): any {
    return action.metadataAction.params.reduce((acc, param) => ({ ...acc, [param]: selection[param] }), {});
  }

  private getFilters(filters?: FilterObject): FilterObject | null {
    return filters && (filters.hasFilter() || filters.hasValues()) ? filters : null;
  }
}
