import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
const format = require('string-format');

import {GridComponent} from '../../../shared/components/grid/grid.component';
import {IToolbarAction, ToolbarActionTypeEnum} from '../../../shared/components/toolbar/toolbar.interface';

import {IPermissionRole} from './permissions.interface';
import {BasePermissionsComponent} from './base.permissions.component';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent extends BasePermissionsComponent implements AfterViewInit {

  private removePermitDisplay: boolean;
  private addPermitDisplay: boolean;
  private editPermitDisplay: boolean;
  private editedPermission: any;
  private currentPermissionRole: IPermissionRole;

  @ViewChild('permitsGrid') permitsGrid: GridComponent;
  @Input() selectionChange: EventEmitter<IPermissionRole>;
  @Output() cloneRole: EventEmitter<IPermissionRole> = new EventEmitter<IPermissionRole>(false);

  columns: Array<any> = [
    { name: 'ID доступа', prop: 'id', minWidth: 70, maxWidth: 100 },
    { name: 'Название', prop: 'name', minWidth: 200, maxWidth: 350 },
    { name: 'Значение', prop: 'value', minWidth: 70, maxWidth: 100 },
    { name: 'Коментарий', prop: 'dsc', width: 200, maxWidth: 400 },
    { name: 'Альт. коментарий', prop: 'altDsc', minWidth: 200 },
  ];

  bottomActions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false },
    { text: 'Копировать', type: ToolbarActionTypeEnum.CLONE, visible: false },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false },
  ];

  bottomActionsSinglePermitGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.CLONE,
    ToolbarActionTypeEnum.REMOVE
  ];

  tabs: Array<any> = [
    {id: 0, title: 'Доступы', active: true},
  ];

  constructor(private http: Http) {
    super({
      read: '/api/roles/{roleId}/permits',
      dataKey: 'permits',
    });
  }

  /**
   * @override
   */
  public ngAfterViewInit(): void {
    // TODO this.selectionChange.subscribe((request: IPermissionsRequest) => { this.addPermissionReadParameters =  ... this.permitsGrid.load(request) });
    this.currentPermissionRole = {roleId: 1};
    this.loadGrid();
  }

  private onAction(action: IToolbarAction) {
    this.editPermitDisplay = false;
    this.addPermitDisplay = false;
    this.removePermitDisplay = false;

    switch (action.type) {
      case ToolbarActionTypeEnum.EDIT:
        this.editPermitDisplay = true;
        break;
      case ToolbarActionTypeEnum.ADD:
        this.addPermitDisplay = true;
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.removePermitDisplay = true;
        break;
      case ToolbarActionTypeEnum.CLONE:
        this.cloneRole.emit(this.currentPermissionRole); // TODO Object.freeze?
        break;
    }
  }

  private beginEditPermission() {
    this.editPermitDisplay = true;
  }

  private selectPermission(records: any[]) {
    if (records.length) {
      this.editedPermission = records[0];
    }

    // TODO Move these functionality inside ToolbarComponent
    this.bottomActions.forEach((action: IToolbarAction) => {
      if (this.bottomActionsSinglePermitGroup.filter((actionType: ToolbarActionTypeEnum) => action.type === actionType).length) {
        action.visible = records.length > 0;
      }
    });
  }

  private onEditPermission(changes) {
    const permitId: number = this.editedPermission.id;

    this.http.put(format(`/api/roles/{roleId}/permits/${permitId}`, this.currentPermissionRole), {
      valueB: !!changes.value
    }).toPromise()
      .then(() => {
        this.editPermitDisplay = false;
        this.loadGrid();
      });
  }

  private onAddPermissions(addedPermissions: Array<any>) {
    this.http.put(format('/api/roles/{roleId}/permits/', this.currentPermissionRole), {
      permitIds: addedPermissions.map((rec: any) => rec.id)
    }).toPromise()
      .then(() => {
        this.addPermitDisplay = false;
        this.loadGrid();
      });
  }

  private onRemovePermission() {
    this.http.request(format('/api/roles/{roleId}/permits', this.currentPermissionRole), {
      method: RequestMethod.Delete,
      body: {
        permitIds: [this.editedPermission.id]
      }
    }).toPromise()
      .then(() => {
        this.removePermitDisplay = false;
        this.loadGrid();
      });
  }

  private loadGrid() {
    this.permitsGrid.load(this.currentPermissionRole);
  }
}
