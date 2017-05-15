import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import { DatePipe } from '@angular/common';

import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { IDynamicFormControl, IValue } from '../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { GridComponent } from '../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html'
})

export class ConstantsComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;
  form: FormGroup;
  display = false;
  editedRecord: any = null;
  tabs: Array<any> = [
    { id: 0, title: 'Константы', active: true },
  ];

  columns: Array<any> = [
    { name: 'Ид', prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
    { name: 'Название константы', prop: 'name', maxWidth: 350 },
    { name: 'Значение', prop: 'value', minWidth: 100, maxWidth: 150 },
    { name: 'Комментарий', prop: 'dsc', width: 200, maxWidth: 400 },
  ];

  controls: Array<IDynamicFormControl> = [
    { label: 'Ид', controlName: 'id', type: 'hidden', required: true, disabled: true },
    { label: 'Название константы', controlName: 'name', type: 'text', required: true, disabled: true },
    { label: 'Тип', controlName: 'typeCode', type: 'select', required: true, disabled: true,
      options: [
        { label: 'Число', value: 1 },
        { label: 'Дата', value: 2 },
        { label: 'Строка', value: 3 },
        { label: 'Булево', value: 4 },
        { label: 'Деньги', value: 5 },
        { label: 'Словарь', value: 6 },
      ]
    },
    { label: 'Значение', controlName: 'value', type: 'dynamic', dependsOn: 'typeCode', required: true },
    { label: 'Комментарий', controlName: 'dsc', type: 'textarea', required: true, disabled: true, rows: 2 },
  ];

  dataSource: IDataSource = {
    read: '/api/constants',
    update: '/api/constants/{id}',
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
          break;
        case 2:
          val.value = this.datePipe.transform(new Date(val.valueD), 'dd.MM.yyyy HH:mm:ss');
          break;
        case 3:
          val.value = val.valueS || '';
          break;
        case 4:
          val.value = Boolean(val.valueB) ? 'Истина' : 'Ложь';
          break;
        default:
          val.value = '';
      }
      return val;
    });
  }

  constructor(private fb: FormBuilder, private http: AuthHttp, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    const ctrls = this.controls.reduce((arr, ctrl) => {
      const config = { disabled: !!ctrl.disabled };
      arr[ctrl.controlName] = ctrl.required
        ? new FormControl(config, Validators.required)
        : new FormControl(config);
      return arr;
    }, {});

    this.form = this.fb.group(ctrls);

    // disable controls where necessary
    this.controls.forEach(ctrl => {
      if (ctrl.disabled) {
        this.form.get(ctrl.controlName).disable();
      }
    });
  }

  populateForm(record: any): void {
    let value = record.value;
    switch (record.typeCode) {
      case 2:
        value = this.datePipe.transform(new Date(record.valueD), 'dd.MM.yyyy');
        break;
      case 3:
        value = value || null;
        break;
      case 4:
        value = value === 'Истина' ? '1' : '0';
        break;
      case 1:
      default:
    }

    const values: IValue = this.controls.reduce((arr, ctrl) => {
      arr[ctrl.controlName] = record[ctrl.controlName];
      return arr;
    }, {});

    // TODO: this is special, to be revised to make more universal
    values.value = value;
    this.form.setValue(values);
  }

  onTabClose(id: number): void {
    this.tabs = this.tabs.filter((tab, tabId) => tabId !== id);
  }

  onEdit(record: any): void {
    this.editedRecord = record;
    this.createForm();
    this.populateForm(record);
    this.display = true;
  }

  getFieldValue(field: string): any {
    return this.form.get(field).value;
  }

  valueToIsoDate(value: any): string {
    const converted = value.split('.').reverse().map(Number);
    return this.datePipe.transform(new Date(converted), 'yyyy-MM-ddTHH:mm:ss') + 'Z';
  }

  onSave(): void {
    const id = this.getFieldValue('id');
    const typeCode = this.getFieldValue('typeCode');
    const value = this.getFieldValue('value');
    const fieldMap: object = {
      1: 'valueN',
      2: 'valueD',
      3: 'valueS',
      4: 'valueB',
    };
    const field: string = fieldMap[this.getFieldValue('typeCode')];
    const body = { [field]: value };

    if (typeCode === 4) {
      // convert the boolean to a number
      body[field] = Number(value);
    } else if (typeCode === 2) {
      // convert the date back to ISO8601
      body[field] = this.valueToIsoDate(value);
    }

    this.grid.update({ id: id }, body)
      .subscribe(
        resp => {
          this.display = false;
          this.form.reset();
          this.grid.load().subscribe();
        },
        // TODO: display & log a message
        error => console.log(error.statusText || error.status || 'Request error')
      );
  }

  onCancel(): void {
    this.display = false;
    this.editedRecord = null;
    this.form.reset();
  }

}
