import { EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';

import { IToolbarAction, ToolbarActionTypeEnum } from '../toolbar/toolbar.interface';
import { GridComponent } from '../grid/grid.component';
import { IDataSource } from '../grid/grid.interface';

export abstract class GridEntityComponent<T> implements OnChanges, OnInit {

  @Input() masterEntity: any;   // TODO master type
  @Output() onSelect: EventEmitter<T> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  action: ToolbarActionTypeEnum;
  selectedEntity: T;
  bottomActionsGroup: Array<ToolbarActionTypeEnum>;
  bottomActionsMasterGroup: Array<ToolbarActionTypeEnum>;
  bottomActions: Array<IToolbarAction>;
  dataSource: IDataSource;

  ngOnInit(): void {
    this.grid.onRowsChange.subscribe(() => this.refreshToolbar());
  }

  public ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
    this.refreshGrid();
  }

  get isEntityBeingCreated(): boolean {
    return this.action === ToolbarActionTypeEnum.ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === ToolbarActionTypeEnum.EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === ToolbarActionTypeEnum.REMOVE;
  }

  parseFn = data => (data[this.dataSource.dataKey] || []) as Array<T>;

  onAction(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        this.afterUpdate();
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
    this.action = null;

    const entity = entities[0];
    if (entity) {
      this.selectedEntity = entity;
      this.refreshToolbar();
      this.onSelect.emit(entity);
    }
  }

  private refreshGrid(): void {
    if (!this.grid) {
      return;
    }

    if (this.masterEntity) {
      this.loadGrid();
    } else {
      this.grid.clear();
    }
  }

  private loadGrid(): void {
    this.grid.load(this.masterEntity)
      .subscribe(
        () => {},
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  private refreshToolbar(): void {
    this.setActionsVisibility(this.bottomActionsGroup, !!this.selectedEntity);
    if (Array.isArray(this.bottomActionsMasterGroup)) {
      this.setActionsVisibility(this.bottomActionsMasterGroup, !!this.masterEntity);
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
    return this.bottomActions.find((action: IToolbarAction) => actionType === action.type);
  }
}
