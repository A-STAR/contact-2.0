import {
  Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';

import { GridComponent } from '../../../shared/components/grid/grid.component';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../shared/components/toolbar/toolbar.interface';
import { GridService } from '../../../shared/components/grid/grid.service';

import { IPermissionRole } from './permissions.interface';
import { BasePermissionsComponent } from './base.permissions.component';
import { IDisplayProperties } from './roles.interface';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent extends BasePermissionsComponent implements AfterViewInit, OnChanges {

  displayProperties: IDisplayProperties = {
    removePermit: false,
    addPermit: false,
    editPermit: false
  };
  private editedPermission: any;

  @ViewChild('permitsGrid') permitsGrid: GridComponent;
  @Input() currentRole: IPermissionRole;
  @Output() cloneRole: EventEmitter<IPermissionRole> = new EventEmitter<IPermissionRole>();

  columns: Array<any> = [
    { name: 'ID доступа', prop: 'id', minWidth: 70, maxWidth: 100 },
    { name: 'Название', prop: 'name', minWidth: 200, maxWidth: 350 },
    { name: 'Значение', prop: 'value', minWidth: 70, maxWidth: 100 },
    { name: 'Описание', prop: 'dsc', minWidth: 200 },
    { name: 'Альт. коментарий', prop: 'altDsc', minWidth: 200 },
    { name: 'Комментарий', prop: 'comment', width: 200, maxWidth: 200 },
  ];

  bottomActions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false },
    { text: 'Копировать', type: ToolbarActionTypeEnum.CLONE },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false },
  ];

  bottomActionsSinglePermitGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE
  ];

  tabs: Array<any> = [
    {id: 0, title: 'Доступы', active: true},
  ];

  constructor(private gridService: GridService) {
    super({
      read: '/api/roles/{id}/permits',
      dataKey: 'permits',
    });
  }

  /**
   * @override
   */
  public ngAfterViewInit() {
    this.refreshGrid();
  }

  /**
   * @override
   */
  public ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    this.refreshGrid();
  }

  private onAction(action: IToolbarAction) {
    this.displayProperties.editPermit = false;
    this.displayProperties.addPermit = false;
    this.displayProperties.removePermit = false;

    switch (action.type) {
      case ToolbarActionTypeEnum.EDIT:
        this.displayProperties.editPermit = true;
        break;
      case ToolbarActionTypeEnum.ADD:
        this.displayProperties.addPermit = true;
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.displayProperties.removePermit = true;
        break;
      case ToolbarActionTypeEnum.CLONE:
        this.cloneRole.emit(this.currentRole);
        break;
    }
  }

  onBeginEditPermission() {
    this.displayProperties.editPermit = true;
  }

  onSelectPermissions(records: any[]) {
    if (records.length) {
      this.editedPermission = records[0];
    }
    this.refreshToolbar(records);
  }

  onEditPermission(changes) {
    const permitId: number = this.editedPermission.id;

    this.gridService.update(`/api/roles/{id}/permits/${permitId}`, this.currentRole, this.prepareData(changes))
      .then(() => {
        this.displayProperties.editPermit = false;
        this.loadGrid();
      });
  }

  onAddPermissions(addedPermissions: Array<any>) {
    this.gridService.create(`/api/roles/{id}/permits`, this.currentRole, {
      permitIds: addedPermissions.map((rec: any) => rec.id)
    }).then(() => {
      this.displayProperties.addPermit = false;
      this.loadGrid();
    });
  }

  onRemovePermission() {
    this.gridService.delete(`/api/roles/{id}/permits`, this.currentRole, {
      permitIds: [this.editedPermission.id]
    }).then(() => {
      this.displayProperties.removePermit = false;
      this.loadGrid();
    });
  }

  private loadGrid() {
    this.permitsGrid.load(this.currentRole)
      .then(() => this.refreshToolbar([]));
  }

  private refreshGrid() {
    if (!this.permitsGrid) {
      return;
    }

    if (this.currentRole) {
      this.loadGrid();
    } else {
      this.permitsGrid.clear();
    }
  }

  private refreshToolbar(records: any[]) {
    // TODO Move these functionality inside ToolbarComponent
    this.bottomActions.forEach((action: IToolbarAction) => {
      if (this.bottomActionsSinglePermitGroup.filter((actionType: ToolbarActionTypeEnum) => action.type === actionType).length) {
        action.visible = records.length > 0;
      }
    });
  }
}
