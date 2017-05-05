import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RequestMethod} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import * as format from 'string-format';

import {GridComponent} from '../../../shared/components/grid/grid.component';
import {IToolbarAction, ToolbarActionTypeEnum} from '../../../shared/components/toolbar/toolbar.interface';

import {IPermissionRole} from './permissions.interface';
import {BasePermissionsComponent} from './base.permissions.component';
import {AuthService} from '../../../core/auth/auth.service';

interface IDisplayProperties {
  removePermit: boolean;
  addPermit: boolean;
  editPermit: boolean;
}

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent extends BasePermissionsComponent implements AfterViewInit {

  displayProperties: IDisplayProperties = {
    removePermit: false,
    addPermit: false,
    editPermit: false
  };
  private editedPermission: any;
  private currentPermissionRole: IPermissionRole;

  @ViewChild('permitsGrid') permitsGrid: GridComponent;
  @Input() selectionChange: EventEmitter<IPermissionRole>;
  @Output() cloneRole: EventEmitter<IPermissionRole> = new EventEmitter<IPermissionRole>(false);

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

  constructor(private http: AuthHttp, private authService: AuthService) {
    super({
      read: '/api/roles/{roleId}/permits',
      dataKey: 'permits',
    });
  }

  /**
   * @override
   */
  ngAfterViewInit(): void {
    this.selectionChange.subscribe((role: IPermissionRole) => {
      this.permitsGrid.load(this.currentPermissionRole = role);
    });
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
        this.cloneRole.emit(this.currentPermissionRole); // TODO Object.freeze?
        break;
    }
  }

  private beginEditPermission() {
    this.displayProperties.editPermit = true;
  }

  private selectPermission(records: any[]) {
    if (records.length) {
      this.editedPermission = records[0];
    }
    this.refreshToolbar(records);
  }

  private onEditPermission(changes) {
    const permitId: number = this.editedPermission.id;

    this.remoteUrl().then(rootUrl => {
      const url: string = format(`${rootUrl}/api/roles/{roleId}/permits/${permitId}`, this.currentPermissionRole);

      this.http.put(url, this.prepareData(changes))
        .toPromise()
        .then(() => {
          this.displayProperties.editPermit = false;
          this.loadGrid();
        });
    });
  }

  private onAddPermissions(addedPermissions: Array<any>) {
    this.remoteUrl().then(rootUrl => {
      this.http.post(format(`${rootUrl}/api/roles/{roleId}/permits`, this.currentPermissionRole), {
        permitIds: addedPermissions.map((rec: any) => rec.id)
      }).toPromise()
        .then(() => {
          this.displayProperties.addPermit = false;
          this.loadGrid();
        });
    });
  }

  onRemovePermission() {
    this.remoteUrl().then(rootUrl => {
      this.http.request(format(`${rootUrl}/api/roles/{roleId}/permits`, this.currentPermissionRole), {
        method: RequestMethod.Delete,
        body: {
          permitIds: [this.editedPermission.id]
        }
      }).toPromise()
        .then(() => {
          this.displayProperties.removePermit = false;
          this.loadGrid();
        });
    });
  }

  private remoteUrl(): Promise<string> {
    return this.authService.getRootUrl().then(rootUrl => rootUrl);
  }

  private loadGrid() {
    this.permitsGrid.load(this.currentPermissionRole)
      .then(() => this.refreshToolbar([]));
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
