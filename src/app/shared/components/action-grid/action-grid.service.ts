import { Injectable } from '@angular/core';

import { IMetadataAction, MetadataActionType, IMetadataCustomAction } from '@app/core/metadata/metadata.interface';
import {
  IMetadataFormConfig,
  IMetadataFormControlType,
  IMetadataFormControl
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import {
  IMetadataActionSetter,
  IGridAction,
  IActionGridAction,
  IGridActionContext,
  IGridActionPayload,
  IGridActionSelection,
  IGridActionFilterSelection } from '@app/shared/components/action-grid/action-grid.interface';

import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

import { compose } from 'ramda';

@Injectable()
export class ActionGridService {

  static DefaultSelectionAction = 'showContactHistory';

  cbActions: { [key: string]: (action: IGridAction) => any };

  private actionPayloads = {
    [MetadataActionType.ALL]: this.getFilterPayload,
    [MetadataActionType.SELECTED]: this.getSelectionPayload,
    [MetadataActionType.SINGLE]: this.getSingleSelectionPayload,
  };

  constructor(
    private massOpsService: MassOperationsService,
  ) {
    this.cbActions = this.createDlgActions();
  }

  getAction(
    actions: IMetadataAction[],
    matcher: (action: IMetadataAction) => boolean,
    onFound: (actions: IMetadataAction[], found: IMetadataAction, index: number) => void = () => null
  ): IMetadataAction {

      let found: IMetadataAction;

      actions.some(function iter(action: IMetadataAction, index: number): boolean {
        if (matcher(action)) {
          found = action;
          onFound(actions, action, index);
          return true;
        }
        return Array.isArray(action.children) && action.children.some(iter);
      });
      return found;
  }

  /**
   * Recursively attaches data to action and it's children
   * @param actions Array of actions
   * @param setters Array of data setters
  */
  attachActionData(actions: IMetadataAction[], setters?: IMetadataActionSetter[]): IMetadataAction[] {
    const noop = [ action => action ];
    return actions.map(action => ({
        ...action,
        // apply action setters in pipe
        ...(compose as any)(...(setters || noop))(action),
        children: action.children ? this.attachActionData(action.children, setters) : undefined
      })
    );
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

  hasParamKey(paramKey: string, action: IGridAction): boolean {
    return action.params && action.params.includes(paramKey);
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

  getCustomOperationConfig(operation: IMetadataCustomAction): IMetadataFormConfig {
    return {
      editable: true,
      items: operation.params.map(param => ({
        disabled: false,
        display: true,
        label: param.name,
        name: param.systemName,
        type: this.getCustomOperationControlType(param.paramTypeCode),
        validators: {
          required: !!param.isMandatory,
        },
        width: 1
      }) as IMetadataFormControl),
      plugins: []
    };
  }

  private getCustomOperationControlType(typeCode: number): IMetadataFormControlType {
    switch (typeCode) {
      case 1:
      case 2:
        return IMetadataFormControlType.DATE;
      case 2:
      case 6:
        return IMetadataFormControlType.TEXT;
      case 3:
      case 4:
      case 5:
      case 7:
      case 8:
      case 11:
      case 13:
        return IMetadataFormControlType.GRIDSELECT;
      case 9:
        return IMetadataFormControlType.CHECKBOX;
      case 12:
        return IMetadataFormControlType.SELECT;
    }
  }

  private getSingleSelection(action: IActionGridAction, selection: any): any {
    return action.metadataAction.params.reduce((acc, param) => ({ ...acc, [param]: selection[param] }), {});
  }

  private getFilters(filters?: FilterObject): FilterObject | null {
    return filters && (filters.hasFilter() || filters.hasValues()) ? filters : null;
  }

  private createDlgActions(): { [key: string]: (action: IGridAction) => any } {
    return Object.keys(this.massOpsService.nonDlgActions).reduce((acc, actionName) => ({
      ...acc,
      [actionName]: (actionData: any, onClose?: Function) =>
        this.massOpsService.nonDlgActions[actionName](this.buildRequest(actionData.payload), onClose)
    }), {});
  }

}
