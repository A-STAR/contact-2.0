import { RowNode, ColDef, GetContextMenuItemsParams } from 'ag-grid';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs/Observable';

import { ICellRendererParams } from 'ag-grid/dist/lib/rendering/cellRenderers/iCellRenderer';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import { ValueSetterParams } from 'ag-grid/dist/lib/entities/colDef';

import { FilterObject } from './filter/grid-filter';

export type AGridSortType = 'asc' | 'desc' | null;
export type IAGridGroups  = string[];
export type IAGridSelected = Array<any>;

export interface IAGridColumn {
  colId: string;
  cellRenderer?: (params: ICellRendererParams) => string;
  cellRendererFramework?: ICellRendererAngularComp;
  cellStyle?: (params: ICellRendererParams) => Partial<CSSStyleDeclaration>;
  dataType: number;
  dictCode?: number;
  disabled?: boolean;
  editable?: boolean;
  filter?: string;
  filterValues?: Array<any>;
  hidden?: boolean;
  label?: string;
  maxWidth?: number;
  minWidth?: number;
  name?: string;
  renderer?: Function;
  // compatibility between @swimlane/ngx-datatable and ag-grid
  $$valueGetter?: Function;
  valueGetter?: (params: ValueGetterParams) => any | string;
  valueSetter?: (params: ValueSetterParams) => any | string;
  sort?: string;
  type?: string;
  width?: number;
}

// The sortModel has no native interface defined
export interface IAGridSortModel {
  colId: string;
  sort: string;
}

export interface IAgridColSetting {
  hide?: boolean;
  colId?: string;
  width?: number;
}

export interface IAGridSettings {
  sortModel: IAGridSortModel[];
  colDefs: IAgridColSetting[];
  filterModel: any;
}

export interface IAGridSorter {
  direction: string;
  field: string;
}

export interface IAGridFilter {
  columnId: string;
  filter: FilterObject;
}

export interface IAGridFilterRequest {
  filters: FilterObject;
  currentPage?: number;
}

export interface IAGridExportableColumn {
  field: string;
  name: string;
}

export interface IAGridRequestAddParam {
  name: string;
  value: string;
}

export interface IAGridRequestParams {
  currentPage?: number;
  pageSize?: number;
  sorters?: IAGridSortModel[];
}

export interface IAGridState extends IAGridRequestParams {
  groups: string[];
  selectedRows: any[];
}

export interface IAGridRequest {
  paging?: {
    pageNumber: number,
    resultsPerPage: number
  };
  sorting?: IAGridSorter[];
  filtering?: FilterObject;
  additionalParameters?: IAGridRequestAddParam;
}

export interface IAGridResponse<T> {
  data?: Array<T>;
  total?: number;
}

export interface IAGridEventPayload {
  type: string;
  payload?:
    number
    |IAGridFilter
    |IAGridGroups
    |IAGridSelected
    |IAGridSortModel[]
    ;
}

// need this, since ag-grid doesn't export this interface
export interface IViewportDatasourceParams {
    /** datasource calls this method when the total row count changes.
     * This in turn sets the height of the grids vertical scroll.
     */
    setRowCount: (count: number) => void;
    /** datasource calls this when new data arrives. The grid then updates the provided rows.
     * The rows are mapped [rowIndex]=>rowData].
     */
    setRowData: (rowData: {
        [key: number]: any;
    }) => void;
    /** datasource calls this when it wants a row node - typically used when it wants to update the row node */
    getRow: (rowIndex: number) => RowNode;
}

export interface ValueGetterParams {
  colDef: ColDef;
  context: any;
  data: any;
  getValue: (field: string) => any;
  node: RowNode;
}

export interface IAGridAction {
  metadataAction: IMetadataAction;
  selection: GetContextMenuItemsParams;
}

export interface IContextMenuItem {
  name: string;
  enabled?: Observable<boolean>;
  onAction?: (action: IAGridAction) => IAGridAction;
  disabled?: boolean;
  shortcut?: string;
  checked?: boolean;
  icon?: HTMLElement | string;
  cssClasses?: string[];
  tooltip?: string;
}
