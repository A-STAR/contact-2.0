import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TabComponent } from '../../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../../shared/components/tabstrip/tabstrip.component';
// import { GridComponent } from '../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-tabledemo',
  templateUrl: './tabledemo.component.html'
})

export class TabledemoComponent implements OnInit {
  form: FormGroup;
  display = false;
  editedRecord: any = null;
  date = '01-01-2016';
  tabs: Array<any> = [
    { id: 0, title: 'Admins', active: true },
    { id: 1, title: 'Users', active: false },
    // { id: 2, title: 'Tab 3', active: false },
    // { id: 3, title: 'Tab 4', active: false },
    // { id: 4, title: 'Tab 5', active: false },
    // { id: 5, title: 'Tab 6', active: false },
    // { id: 6, title: 'Tab 7', active: false },
    // { id: 7, title: 'Tab 8', active: false },
    // { id: 8, title: 'Tab 9', active: false },
    // { id: 9, title: 'Tab 10', active: false },
  ];

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
