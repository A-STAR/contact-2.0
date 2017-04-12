import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TableData } from './ngxdatatable.data';

@Component({
  selector: 'app-datatable',
  templateUrl: './ngxdatatable.component.html',
  styleUrls: ['./ngxdatatable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxDatatableComponent implements OnInit, AfterViewInit {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;
  // @ViewChild(DatatableComponent) table: DatatableComponent;

  ngAfterViewInit() {
    // set up the height of datatable - it does not work with height specified
    const height = this.element.offsetHeight;
    // this.dataTableRef.nativeElement.style.height = `${height}px`;
    // this.dataTable.recalculate();
    // this.table.bodyHeight = 400;
  }

  element: HTMLElement;
  rows: Array<any> = [];
  selected: Array<any> = [];

  constructor(private http: Http, element: ElementRef) {

    this.element = element.nativeElement;
    http.get('assets/server/100k.json')
        .subscribe((data) => {
          setTimeout(() => {
            this.rows = data.json();
          }, 1000);
        });
  }

  // public columns: Array<any> = [
  //   { prop: 'name' },
  //   { name: 'City' },
  //   { name: 'Age' },
  //   { name: 'Email' },
  //   { name: 'RegDate' },
  // ];

  public length: number = 0;

  public ngOnInit(): void {
    // this.onChangeTable(this.config);
  }

  public onSelect({ selected }): void {
    // console.log(event.selected);
    this.selected = this.selected.splice(0, this.selected.length);
    this.selected.concat(selected);
  }

  public getRowHeight(row): number {
    return row.height;
  }

}
