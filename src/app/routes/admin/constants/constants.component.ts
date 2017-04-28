import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TabComponent } from '../../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../../shared/components/tabstrip/tabstrip.component';
import { IDataSource } from '../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html'
})

export class ConstantsComponent implements OnInit {
  form: FormGroup;
  display = false;
  editedRecord: any = null;
  tabs: Array<any> = [
    { id: 0, title: 'Константы', active: true },
  ];

  columns: Array<any> = [
    { name: '#', prop: 'id', minWidth: 30, maxWidth: 70,  },
    { name: 'Наименование', prop: 'name', maxWidth: 350 },
    { name: 'Значение', prop: 'value', minWidth: 100, maxWidth: 150 },
    { name: 'Коментарий', prop: 'dsc', width: 200, maxWidth: 400 },
    { name: 'Альт. коментарий', prop: 'altDsc', minWidth: 200 },
  ];

  dataSource: IDataSource = {
    read: '/api/constants',
    dataKey: 'constants',
  };

  parseFn = (data) => {
    const { dataKey } = this.dataSource;
    const dataSet = data[dataKey];
    if (!dataSet) {
      return [];
    }
    return dataSet.map(val => {
      switch (val.typeCode) {
        case 1:
          val.value = String(val.valueN);
          delete val.valueN;
          break;
        case 2:
          val.value = Date.parse(val.valueD);
          delete val.valueD;
          break;
        case 3:
          val.value = val.valueS;
          delete val.valueS;
          break;
        case 4:
          val.value = Boolean(val.valueB);
          delete val.valueB;
          break;
        default:
          val.value = '';
      }
      return val;
    });
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

  createForm(record: any) {
    this.form = this.fb.group({
      id: new FormControl({ value: record.id, disabled: true }, Validators.required),
      name: [ record.name, Validators.required ],
      typeCode: [ record.typeCode, Validators.required ],
      value:  [ record.value, Validators.required ],
      dsc: [ record.dsc ],
      altDsc: [ record.altDsc ],
    });
  }

  onClose(id: number): void {
    this.tabs = this.tabs.filter((tab, tabId) => tabId !== id);
  }

  onEdit(record: any): void {
    this.editedRecord = record;
    this.createForm(record);
    this.display = true;
  }

  get dialogTitle() {
    return !this.editedRecord ? null : this.editedRecord.name || this.editedRecord.id || 'No title';
  }
}
