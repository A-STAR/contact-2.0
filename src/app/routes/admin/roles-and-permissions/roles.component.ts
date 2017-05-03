import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDataSource } from '../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  selectedRole: any = null;
  @Output() onSelect: EventEmitter<number> = new EventEmitter(false);

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
      maxWidth: 350,
    },
    {
      name: 'Комментарий',
      prop: 'obj_comment',
      width: 200,
      maxWidth: 400,
    },
  ];

  dataSource: IDataSource = {
    read: '/api/roles',
    dataKey: 'roles',
  };

  parseFn(data) {
    return data.roles;
  }

  onSelectedRowChange(event) {
    this.onSelect.emit(event && event.id);
  }
}
