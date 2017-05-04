import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDynamicFormControl } from '../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { IRoleRecord, TRoleFormAction } from './roles.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  static ACTIONS = {
    CREATE: {
      popupTitle: () => 'Новая роль',
      actionButton: 'Добавить',
      controls: ['name', 'obj_comment'],
      formAction: () => Promise.resolve()
    },
    EDIT: {
      popupTitle: name => name,
      actionButton: 'Сохранить',
      controls: ['name', 'obj_comment'],
      formAction: (grid: GridComponent, role: IRoleRecord) => grid.update(role.id, role)
    },
    COPY: {
      popupTitle: () => 'Копирование роли',
      actionButton: 'Копировать',
      controls: ['name', 'original', 'obj_comment'],
      formAction: () => Promise.resolve()
    },
    DELETE: {
      popupTitle: name => `Вы уверены, что хотите удалить роль ${name}?`,
      actionButton: 'Удалить',
      controls: [],
      formAction: () => Promise.resolve()
    },
  };

  static CONTROLS: Array<IDynamicFormControl> = [
    { label: 'Название оригинальной роли', controlName: 'original', type: 'text', required: true, disabled: true },
    { label: 'Название', controlName: 'name', type: 'text', required: true, disabled: false },
    { label: 'Комментарий', controlName: 'obj_comment', type: 'textarea', required: true, disabled: false, rows: 2 },
  ];

  @Output() onSelect: EventEmitter<number> = new EventEmitter(false);
  @ViewChild(GridComponent) grid: GridComponent;

  form: FormGroup;
  editedRole: IRoleRecord = null;
  selectedRole: IRoleRecord = null;
  action: TRoleFormAction = null;

  columns: Array<any> = [
    { name: '#', prop: 'id', minWidth: 30, maxWidth: 70 },
    { name: 'Название', prop: 'name', maxWidth: 400 },
    { name: 'Комментарий', prop: 'obj_comment', width: 200, maxWidth: 500 },
  ];

  controls: Array<IDynamicFormControl> = [];

  dataSource: IDataSource = {
    read: '/api/roles',
    update: '/api/roles',
    dataKey: 'roles',
  };

  // TODO: move http logic into data service
  constructor(private formBuilder: FormBuilder) {
  }

  get title() {
    return RolesComponent.ACTIONS[this.action] && RolesComponent.ACTIONS[this.action].popupTitle.call(this, this.editedRole && this.editedRole.name);
  }

  get actionButtonTitle() {
    return RolesComponent.ACTIONS[this.action] && RolesComponent.ACTIONS[this.action].actionButton;
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
    }
  }

  onEdit(role: IRoleRecord) {
    this.action = 'EDIT';
    this.editedRole = role;
    this.createForm();
  }

  onDisplayChange(event) {
    if (!event) {
      this.editedRole = null;
      this.action = null;
    }
  }

  canEdit() {
    return !!this.selectedRole;
  }

  canCopy() {
    return !!this.selectedRole;
  }

  canDelete() {
    return !!this.selectedRole;
  }

  save() {
    this.createFormAction()
      .then(result => {
        // FIXME: only on successful request
        this.editedRole = null;
        this.action = null;
        console.log(result);
      })
      .catch(error => console.log(error));
  }

  cancel() {
    this.editedRole = null;
    this.action = null;
  }

  create() {
    this.action = 'CREATE';
    this.editedRole = this.createEmptyRole();
    this.createForm();
  }

  edit() {
    this.action = 'EDIT';
    this.editedRole = this.selectedRole;
    this.createForm();
  }

  copy() {
    this.action = 'COPY';
    this.editedRole = {
      ...this.createEmptyRole(),
      original: this.selectedRole.name
    };
    this.createForm();
  }

  delete() {
    this.action = 'DELETE';
    this.editedRole = this.selectedRole;
    this.createForm();
  }

  private createEmptyRole(): IRoleRecord {
    return {
      id: null,
      name: '',
      obj_comment: ''
    };
  }

  private createFormAction() {
    return RolesComponent.ACTIONS[this.action] && RolesComponent.ACTIONS[this.action].formAction.call(this, this.grid, this.editedRole);
  }

  private createForm() {
    const controls = RolesComponent.ACTIONS[this.action] && RolesComponent.ACTIONS[this.action].controls;
    this.controls = this.getControls(controls);
    this.form = this.formBuilder.group(this.getFormControls(controls));
  }

  private getControls(names: Array<string>) {
    return RolesComponent.CONTROLS
      .filter(control => names.includes(control.controlName));
  }

  private getFormControls(names: Array<string>) {
    return RolesComponent.CONTROLS
      .filter(control => names.includes(control.controlName))
      .reduce((acc, control) => {
        acc[control.controlName] = new FormControl({ value: this.editedRole[control.controlName], disabled: control.disabled }, Validators.required);
        return acc;
      }, {});
  }
}
