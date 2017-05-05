import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDynamicFormControl } from '../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../shared/components/toolbar/toolbar.interface';
import { IRoleRecord } from './roles.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  /*
  roles = {
    edit: null,
    remove: null,
  };
  */

  @Output() onSelect: EventEmitter<number> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  currentRole: IRoleRecord = null;
  selectedRole: IRoleRecord = null;
  action: ToolbarActionTypeEnum = null;

  bottomActions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD, visible: true },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false },
    { text: 'Копировать', type: ToolbarActionTypeEnum.CLONE, visible: false },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false },
  ];

  bottomActionsSinglePermitGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.CLONE,
    ToolbarActionTypeEnum.REMOVE
  ];

  columns: Array<any> = [
    { name: '#', prop: 'id', minWidth: 30, maxWidth: 70 },
    { name: 'Название', prop: 'name', maxWidth: 400 },
    { name: 'Комментарий', prop: 'comment', width: 200, maxWidth: 500 },
  ];

  dataSource: IDataSource = {
    read: '/api/roles',
    update: '/api/roles',
    dataKey: 'roles',
  };

  constructor(private formBuilder: FormBuilder) {
  }

  get isRoleBeingCreatedOrEdited() {
    return this.currentRole && (this.action === ToolbarActionTypeEnum.ADD || this.action === ToolbarActionTypeEnum.EDIT);
  }

  get isRoleBeingRemoved() {
    return this.currentRole && this.action === ToolbarActionTypeEnum.REMOVE;
  }

  parseFn(data): Array<IRoleRecord> {
    const { dataKey } = this.dataSource;
    return data[dataKey] || [];
  }

  onSelectedRowChange(roles: Array<IRoleRecord>) {
    const role = roles[0];
    if (role && role.id && (this.selectedRole && this.selectedRole.id !== role.id || !this.selectedRole)) {
      this.selectedRole = role;
      this.onSelect.emit(this.selectedRole.id);
      this.refreshToolbar();
    }
  }

  onEdit(role: IRoleRecord) {
    this.currentRole = this.selectedRole;
  }

  onAction(action: IToolbarAction) {
    this.action = action.type;
    switch (action.type) {
      case ToolbarActionTypeEnum.EDIT:
        this.currentRole = this.selectedRole;
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.currentRole = this.selectedRole;
        break;
      case ToolbarActionTypeEnum.ADD:
        this.currentRole = this.createEmptyRole();
        break;
      case ToolbarActionTypeEnum.CLONE:
        /*
        this.editedRole = {
          ...this.createEmptyRole(),
          original: this.selectedRole.name
        };
        */
        break;
    }
  }

  callActionByType(type: ToolbarActionTypeEnum) {
    this.onAction(this.bottomActions.filter((action: IToolbarAction) => type === action.type)[0]);
  }

  private createEmptyRole() {
    return {
      id: null,
      name: '',
      comment: ''
    };
  }

  private refreshToolbar() {
    // TODO: load user permissions
    this.bottomActions.forEach(action => action.visible = true);
  }
}
