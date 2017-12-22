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
import { GridOptions } from 'ag-grid/main';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged, filter, first, map, tap, withLatestFrom } from 'rxjs/operators';

import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import {
  IAGridAction,
  IAGridColumn,
  IAGridRequestParams,
  IAGridSelected,
  IAGridSortModel,
} from '../grid2/grid2.interface';

import { GridService } from '../grid/grid.service';
import { UserConstantsService } from '../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

import { Grid2Component } from '../grid2/grid2.component';
import { MetadataFilterComponent } from '../metadata-grid/filter/metadata-filter.component';

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
  @ViewChild(MetadataFilterComponent) filter: MetadataFilterComponent;

  private _columns: IAGridColumn[];
  private _initialized = false;

  private actions$ = new BehaviorSubject<any[]>(null);

  private actionsWithPermissions$ = combineLatest(
    this.actions$.pipe(filter(Boolean)),
    this.userConstantsService.bag(),
    this.userPermissionsService.bag(),
  )
  .pipe(
    map(([ actions, constants, permissions ]) => {
      return [
        ...actions,
        {
          action: 'smsCreate',
          params: [ 'debtId', 'personId' ],
          addOptions: [
            {
              name: 'personRole',
              value: [ 1 ],
            },
          ],
          enabled: action => {
            const personRole = action.addOptions.find(option => option.name === 'personRole').value[0];
            return constants.has('SMS.Use') && permissions.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', personRole);
          },
        },
        {
          action: 'emailCreate',
          params: [ 'debtId', 'personId' ],
          addOptions: [
            {
              name: 'personRole',
              value: [ 1 ],
            },
          ],
          enabled: action => {
            const personRole = action.addOptions.find(option => option.name === 'personRole').value[0];
            return constants.has('Email.Use') && permissions.contains('EMAIL_SINGLE_FORM_PERSON_ROLE_LIST', personRole);
          },
        },
      ];
    }),
  );

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.gridService.getMetadata(this.metadataKey, {})
      .pipe(first())
      .subscribe(({ actions, columns }) => {
        this.actions$.next(actions);
        this._columns = [ ...columns ];
        this._initialized = true;
        this.cdRef.markForCheck();
      });
  }

  get selected(): T[] {
    return this.grid && this.grid.selected || [] as any[];
  }

  get gridActions$(): Observable<any[]> {
    return this.actionsWithPermissions$;
  }

  get gridOptions(): GridOptions {
    return this.grid && this.grid.gridOptions;
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
    const filters = this.grid.getFilters();
    if (this.filter) {
      filters.addFilter(this.filter.filters);
    }
    return filters;
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid.getRequestParams();
  }
}
