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
    { id: 0, title: 'Constants', active: true },
  ];

  columns: Array<any> = [
    // { width: 20, maxWidth: 20, sortable: false, draggable: false,
    //   resizeable: false, canAutoResize: true, headerCheckboxable: false, checkboxable: false
    // },
    { prop: 'id', name: '#', minWidth: 30, maxWidth: 70 },
    { name: 'Name', width: 150 },
    { name: 'Gender', minWidth: 80, maxWidth: 100 },
    { name: 'Age', width: 50, maxWidth: 50 },
    { name: 'City', prop: 'address.city', minWidth: 200, maxWidth: 200 },
    { name: 'State', prop: 'address.state', minWidth: 200 },
  ];

  dataSource: IDataSource = {
    read: '/api/constants',
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

  createForm(record: any) {
    this.form = this.fb.group({
      id: new FormControl({ value: record.id, disabled: true }, Validators.required),
      name: [ record.name, Validators.required ],
      city:  [ record.address.city, Validators.required ],
      state: [ record.address.state, Validators.required ],
      age: [ record.age, Validators.required ],
      isAdmin: ['0'],
      gender: [ record.gender, Validators.required ],
      birthdate: new FormControl()
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

  get popupTitle() {
    return this.editedRecord && this.editedRecord.name ? this.editedRecord.name : null;
  }
}
