import { Component, OnInit } from '@angular/core';

import { TabComponent } from '../../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../../shared/components/tabstrip/tabstrip.component';
import { NgxDatatableComponent } from '../../../routes/tables/datatable/datatable.component';

@Component({
  selector: 'app-tabledemo',
  templateUrl: './tabledemo.component.html'
})

export class TabledemoComponent implements OnInit {
  editedRecord: any = null;

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

  constructor() { }

  ngOnInit() { }

  onClose(id): void {
    this.tabs = this.tabs.filter((tab, tabId) => tabId !== id);
  }

  onEdit(record): void {
    this.editedRecord = record;
  }
}
