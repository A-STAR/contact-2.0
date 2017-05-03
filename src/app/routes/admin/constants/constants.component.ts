import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import { DatePipe } from '@angular/common';

// import { HttpService } from '../../../core/auth/auth-http.service';
import { TabComponent } from '../../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../../shared/components/tabstrip/tabstrip.component';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
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
    { name: '#', prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
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
          val.value = this.datePipe.transform(new Date(val.valueD), 'dd.MM.yyyy HH:mm:ss');
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

  constructor(private fb: FormBuilder, private http: AuthHttp, private datePipe: DatePipe) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [ '', Validators.required ],
      name: [ '', Validators.required ],
      typeCode: [ '', Validators.required ],
      value:  [ '', Validators.required ],
      dsc: '',
      altDsc: '',
    });
    this.form.get('id').disable();
    this.form.get('name').disable();
    this.form.get('typeCode').disable();
    this.form.get('dsc').disable();
    this.form.get('altDsc').disable();
  }

  populateForm(record: any) {
    this.form.setValue({
      id: record.id,
      name: record.name,
      typeCode: record.typeCode,
      value:  record.value,
      dsc: record.dsc,
      altDsc: record.altDsc,
    });
  }

  onClose(id: number): void {
    this.tabs = this.tabs.filter((tab, tabId) => tabId !== id);
  }

  onEdit(record: any): void {
    this.editedRecord = record;
    this.populateForm(record);
    this.display = true;
  }

  onSave(): void {
    const root = 'http://localhost:8080';
    const id = this.form.get('id').value;
    const value = this.form.get('value').value;
    const fieldMap: object = {
      1: 'valueN',
      2: 'valueD',
      3: 'valueS',
      4: 'valueB',
    };
    const field: string = fieldMap[this.form.get('typeCode').value];
    const body = { [field]: value };
    console.log('typecode', this.form.get('typeCode').value);
    console.log('value', this.form.get('value').value);

    if (this.form.get('typeCode').value === 4) {
      body[field] = Number(value);
    }
    this.http.put(`${root}/api/constants/${id}`, body)
      .toPromise()
      .then(resp => {
        this.display = false;
        this.form.reset();
        this.grid.load();
      })
      .catch(error => {
        console.log(error.statusText || error.status || 'Request error');
      });
  }

  onCancel(): void {
    this.display = false;
    this.form.reset();
  }

  get dialogTitle() {
    return !this.editedRecord ? null : this.editedRecord.name || this.editedRecord.id || 'No title';
  }
}
