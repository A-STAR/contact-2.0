import { EventEmitter, Input, OnChanges, Output, SimpleChange, ViewChild } from '@angular/core';

import { IToolbarAction, ToolbarActionTypeEnum } from '../toolbar/toolbar.interface';
import { GridComponent } from '../grid/grid.component';
import { IGridEntity } from './grid.entity.interface';
import { IDataSource } from '../grid/grid.interface';

export abstract class GridEntityComponent<T extends IGridEntity> implements OnChanges {

  @Input() masterEntity: any;   // TODO master type
  @Output() onSelect: EventEmitter<T> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  action: ToolbarActionTypeEnum;
  selectedEntity: T;
  bottomActionsGroup: Array<ToolbarActionTypeEnum>;
  bottomActions: Array<IToolbarAction>;
  dataSource: IDataSource;

  public ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
    console.log('changes: ', changes);
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

  parseFn(data: any): Array<T> {
    const {dataKey} = this.dataSource;
    return data[dataKey] || [];
  }

  onAction(action: IToolbarAction): void {
    this.action = action.type;
  }

  onEdit(): void {
    this.action = ToolbarActionTypeEnum.EDIT;
  }

  afterUpdate(): void {
    this.selectedEntity = null;

    this.grid.load()
      .subscribe(
        () => this.refreshToolbar(),
        // TODO: display & log a message
        err => console.error(err)
      );
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

  callActionByType(type: ToolbarActionTypeEnum): void {
    this.onAction(this.bottomActions.find((action: IToolbarAction) => type === action.type));
  }

  private refreshGrid(): void {
    if (!this.grid) {
      return;
    }

    if (this.selectedEntity) {
      this.loadGrid();
    } else {
      this.grid.clear();
    }
  }

  private loadGrid(): void {
    this.grid.load(this.masterEntity)
      .subscribe(
        () => this.refreshToolbar(),
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  private refreshToolbar(): void {
    this.setActionsVisibility(this.bottomActionsGroup, !!this.selectedEntity);
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      this.bottomActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });
  }
}
