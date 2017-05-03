import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDataSource } from '../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  columns: Array<any> = [
    {
      name: '#',
      prop: 'id',
      minWidth: 30,
      maxWidth: 70,
    },
    {
      name: 'Наименование',
      prop: 'name',
      maxWidth: 350,
    },
    {
      name: 'Коментарий',
      prop: 'dsc',
      width: 200,
      maxWidth: 400,
    },
  ];

  dataSource: IDataSource = {
    read: '/api/roles',
    dataKey: 'roles',
  };
}
