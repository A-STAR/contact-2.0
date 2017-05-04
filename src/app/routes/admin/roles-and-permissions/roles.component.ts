import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { IRoleRecord } from './roles.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  @Output() onSelect: EventEmitter<number> = new EventEmitter(false);

  form: FormGroup;
  editedRecord: any = null;
  selectedRoleId: number = null;

  columns: Array<any> = [
    {
      name: '#',
      prop: 'id',
      minWidth: 30,
      maxWidth: 70,
    },
    {
      name: 'Название',
      prop: 'name',
      maxWidth: 400,
    },
    {
      name: 'Комментарий',
      prop: 'obj_comment',
      width: 200,
      maxWidth: 500,
    },
  ];

  dataSource: IDataSource = {
    read: '/api/roles',
    dataKey: 'roles',
  };

  constructor(private formBuilder: FormBuilder) {
  }

  parseFn(data): Array<IRoleRecord> {
    return data.roles;
  }

  onSelectedRowChange(event: IRoleRecord) {
    if (event && event.id && event.id !== this.selectedRoleId) {
      this.selectedRoleId = event.id;
      this.onSelect.emit(this.selectedRoleId);
    }
  }

  onEdit(event: IRoleRecord) {
    this.editedRecord = event;
    this.form = this.createForm();
  }

  onDisplayChange(event) {
    if (!event) {
      this.editedRecord = null;
    }
  }

  save() {
    console.log('Saving...');
    this.editedRecord = null;
  }

  cancel() {
    this.editedRecord = null;
  }

  createForm() {
    return this.formBuilder.group({
      id: new FormControl({ value: this.editedRecord.id, disabled: true }, Validators.required),
      name: [ this.editedRecord.name, Validators.required ],
      comment: [ this.editedRecord.obj_comment, Validators.required ],
    });
  }

  get title() {
    return this.editedRecord && this.editedRecord.name;
  }
}
