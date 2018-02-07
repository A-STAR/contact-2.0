import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  ViewEncapsulation,
  Input, OnInit, Output
} from '@angular/core';

import 'ag-grid-enterprise';
import { ColDef, GridApi } from 'ag-grid';

import { IGridTreeRow } from '@app/shared/components/gridtree2/gridtree2.interface';

@Component({
  selector: 'app-gridtree2',
  templateUrl: './gridtree2.component.html',
  styleUrls: [ './gridtree2.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GridTree2Component<T> implements OnInit {
  @Input() rows: IGridTreeRow<T>[];
  @Input() columns: ColDef[];
  @Input() translateColumnLabels: boolean;
  @Input() autoGroupColumnDef: ColDef;
  @Input() rowSelection = 'single';
  @Input() getDataPath: Function;
  @Input() dnd: boolean;

  @Output() select = new EventEmitter<IGridTreeRow<T>>();

  gridApi: GridApi;
  groupDefaultExpanded: number;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.groupDefaultExpanded = -1;
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.cdRef.markForCheck();
  }

  onSelect(): void {
    this.select.emit(this.gridApi.getSelectedRows()[0]);
  }
}
