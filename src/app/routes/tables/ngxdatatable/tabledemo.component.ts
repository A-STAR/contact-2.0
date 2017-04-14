import { Component, OnInit } from '@angular/core';

import { TabComponent } from '../../../shared/components/tabstrip/tab.component';
import { TabstripComponent } from '../../../shared/components/tabstrip/tabstrip.component';
import { NgxDatatableComponent } from '../../../routes/tables/ngxdatatable/ngxdatatable.component';

@Component({
  selector: 'app-tabledemo',
  template: `
    <div class="content-heading">
        Data Grid
    </div>

    <app-tabstrip>
      <app-tab *ngFor="let tab of tabs" [title]="tab.title" (onClose)="onClose($event)" [active]="tab.active">
        <app-datatable></app-datatable>
      </app-tab>
    </app-tabstrip>
  `
})

export class TabledemoComponent implements OnInit {
  tabs: Array<any> = [
    { id: 0, title: 'Tab 1', active: true },
    { id: 1, title: 'Tab 2', active: false },
    { id: 2, title: 'Tab 3', active: false },
    { id: 3, title: 'Tab 4', active: false },
    { id: 4, title: 'Tab 5', active: false },
    { id: 5, title: 'Tab 6', active: false },
    { id: 6, title: 'Tab 7', active: false },
    { id: 7, title: 'Tab 8', active: false },
    { id: 8, title: 'Tab 9', active: false },
    { id: 9, title: 'Tab 10', active: false },
  ];

  constructor() { }

  ngOnInit() { }

  public onClose(id) {
    console.log('closed', id);
    this.tabs = this.tabs.filter((tab, tabId) => tabId !== id);
  }

}
