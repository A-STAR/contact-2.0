import {
  AfterViewInit,
  EventEmitter,
  Input,
  // OnChanges,
  OnDestroy,
  Output,
  // SimpleChange,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IToolbarAction, ToolbarActionTypeEnum } from '../toolbar/toolbar.interface';
import { IDataSource, IGridColumn, IRenderer } from '../grid/grid.interface';

import { GridComponent } from '../grid/grid.component';

export abstract class GridEntityComponent<T> implements OnDestroy, AfterViewInit {

  // TODO(a.poterenko): implement a master type
  @Input() masterEntity: any;
  @Output() onSelect: EventEmitter<T> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  action: ToolbarActionTypeEnum;
  dataSource: IDataSource;
  columns: Array<IGridColumn> = [];
  toolbarActionsGroup: Array<ToolbarActionTypeEnum>;
  toolbarActionsMasterGroup: Array<ToolbarActionTypeEnum>;
  toolbarActions: Array<IToolbarAction>;
  renderers: IRenderer = {};
  selectedEntity: T;

  private rowChangeSub: Subscription;

  ngAfterViewInit(): void {
    this.rowChangeSub = this.grid.onRowsChange.subscribe(() => this.refreshToolbar());
  }

  // NOTE: Dead code, either never fires or refreshes the grid unnecessarily
  // NOTE: We manipulate the grid refresh manually, upon each action
  // ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
  //   console.log('refresh fired');
  //   this.refreshGrid();
  // }

  // TODO(a.tymchuk): rename to a more semantic `isRecordBeingCreated`
  get isEntityBeingCreated(): boolean {
    return this.action === ToolbarActionTypeEnum.ADD;
  }

  // TODO(a.tymchuk): rename to a more semantic `isRecordBeingEdited`
  get isEntityBeingEdited(): boolean {
    return this.action === ToolbarActionTypeEnum.EDIT;
  }

  // TODO(a.tymchuk): rename to a more semantic `isRecordBeingRemoved`
  get isEntityBeingRemoved(): boolean {
    return this.action === ToolbarActionTypeEnum.REMOVE;
  }

  parseFn = data => (data[this.dataSource.dataKey] || []) as Array<T>;

  onAction(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        this.afterUpdate();
        break;
      case ToolbarActionTypeEnum.EDIT:
        this.onEdit();
        break;
      default:
        this.action = action.type;
    }
  }

  cancelAction(): void {
    this.action = null;
  }

  onEdit(): void {
    this.action = ToolbarActionTypeEnum.EDIT;
  }

  afterUpdate(): void {
    this.selectedEntity = null;
    this.loadGrid();
  }

  onSelectedRowChange(entities: T[]): void {
    const entity = entities[0];
    this.action = null;

    if (entity) {
      this.selectedEntity = entity;
      this.refreshToolbar();
      this.onSelect.emit(entity);
    }
  }

  ngOnDestroy(): void {
    if (this.rowChangeSub) {
      this.rowChangeSub.unsubscribe();
    }
  }

  // private refreshGrid(): void {
  //   if (!this.grid) {
  //     return;
  //   }

  //   if (this.masterEntity) {
  //     this.loadGrid();
  //   } else {
  //     this.grid.clear();
  //   }
  // }

  loadGrid(): void {
    this.grid.load(this.masterEntity)
      .take(1)
      .subscribe(
        () => {},
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  private refreshToolbar(): void {
    this.setActionsVisibility(this.toolbarActionsGroup, !!this.selectedEntity);
    if (Array.isArray(this.toolbarActionsMasterGroup)) {
      this.setActionsVisibility(this.toolbarActionsMasterGroup, !!this.masterEntity);
    }

    const refreshAction: IToolbarAction = this.findToolbarActionByType(ToolbarActionTypeEnum.REFRESH);
    if (refreshAction) {
      refreshAction.visible = this.grid.rows.length > 0;
    }
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) =>
      this.findToolbarActionByType(actionType).visible = visible);
  }

  private findToolbarActionByType(actionType: ToolbarActionTypeEnum): IToolbarAction {
    return this.toolbarActions.find((action: IToolbarAction) => actionType === action.type);
  }
}
