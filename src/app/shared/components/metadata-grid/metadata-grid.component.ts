import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import {
  IAGridAction,
  IAGridColumn,
  IAGridRequestParams,
  IAGridSelected,
  IAGridSortModel,
} from '../grid2/grid2.interface';

import { GridService } from '../grid/grid.service';

import { Grid2Component } from '../grid2/grid2.component';

import { FilterObject } from '../grid2/filter/grid-filter';

@Component({
  selector: 'app-metadata-grid',
  templateUrl: 'metadata-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataGridComponent<T> implements OnInit {
  @Input() columnIds: string[];
  @Input() metadataKey: string;
  @Input() ngClass: string;
  @Input() persistenceKey: string;
  @Input() rowIdKey: string;
  @Input() rows: T[] = [];
  @Input() rowCount: number;

  @Output() action = new EventEmitter<IAGridAction>();
  @Output() onDblClick = new EventEmitter<T>();
  @Output() onFilter = new EventEmitter<FilterObject>();
  @Output() onPage = new EventEmitter<number>();
  @Output() onPageSize = new EventEmitter<number>();
  @Output() onSort = new EventEmitter<IAGridSortModel[]>();
  @Output() onSelect = new EventEmitter<IAGridSelected>();

  @ViewChild(Grid2Component) grid: Grid2Component;

  private _actions: IMetadataAction[];
  private _columns: IAGridColumn[];
  private _initialized = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.gridService.getActions(this.metadataKey).pipe(first()),
      this.gridService.getColumnMeta(this.metadataKey, {}).pipe(first()),
    )
    .subscribe(([ actions, columns ]) => {
      this._actions = actions;
      this._columns = [ ...columns ];
      this._initialized = true;
      this.cdRef.markForCheck();
    });
  }

  get selected(): T[] {
    return this.grid.selected as any[];
  }

  get actions(): IMetadataAction[] {
    return this._actions || [];
  }

  get columns(): IAGridColumn[] {
    return this._columns || [];
  }

  get initialized(): boolean {
    return this._initialized;
  }

  onAction(event: any): void {
    this.action.emit(event);
  }

  onDblClickHandler(event: any): void {
    this.onDblClick.emit(event);
  }

  onFilterHandler(): void {
    this.onFilter.emit();
  }

  onPageHandler(): void {
    this.onPage.emit();
  }

  onPageSizeHandler(): void {
    this.onPageSize.emit();
  }

  onSortHandler(): void {
    this.onSort.emit();
  }

  onSelectHandler(event: any): void {
    this.onSelect.emit(event);
  }

  getFilters(): FilterObject {
    return this.grid.getFilters();
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid.getRequestParams();
  }
}
