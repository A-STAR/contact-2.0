import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TableData } from './datatable.data';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class NgxDatatableComponent implements AfterViewInit {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;

  element: HTMLElement;
  rows: Array<any> = [];
  selected: Array<any> = [];
  columns: Array<any> = [
    { prop: 'id', name: '#', minWidth: 30, maxWidth: 70 },
    { name: 'Name', width: 150 },
    { name: 'Gender', minWidth: 80, maxWidth: 100 },
    { name: 'Age', width: 50, maxWidth: 50 },
    { name: 'City', prop: 'address.city', minWidth: 200, maxWidth: 200 },
    { name: 'State', prop: 'address.state', minWidth: 200 },
  ];

  constructor(private http: Http, element: ElementRef) {

    this.element = element.nativeElement;
    http.get('assets/server/100k.json')
        .subscribe((data) => {
          setTimeout(() => {
            this.rows = data.json();
          }, 1000);
        });
  }

  ngAfterViewInit() {
    // set up the height of datatable - it does not work with height specified
    const height = this.element.offsetHeight;
    // this.dataTableRef.nativeElement.style.height = `${height}px`;
    // this.dataTable.recalculate();
    // this.dataTable.bodyHeight = 400;
  }

  public onSelect({ selected }): void {
    // console.log(selected);
    this.selected = [].concat(selected);
  }

  public getRowHeight(row): number {
    return row.height;
  }

}
