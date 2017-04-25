import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Http } from '@angular/http';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class NgxDatatableComponent implements AfterViewInit {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;
  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  element: HTMLElement;
  rows: Array<any> = [];
  selected: Array<any> = [];
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
  cssClasses: object = {
    sortAscending: 'fa fa-angle-down',
    sortDescending: 'fa fa-angle-up',
    pagerLeftArrow: 'fa fa-angle-left',
    pagerRightArrow: 'fa fa-angle-right',
    pagerPrevious: 'fa fa-angle-double-left',
    pagerNext: 'fa fa-angle-double-right',
  };

  constructor(private gridService: GridService, element: ElementRef) {
    this.element = element.nativeElement;
    this.gridService
      .fetchData()
      .then(data => this.rows = data);
  }

  ngAfterViewInit() {
    // set up the height of datatable - it does not work with height specified
    const height = this.element.offsetHeight;
    // this.dataTableRef.nativeElement.style.height = `${height}px`;
    // this.dataTable.recalculate();
    // this.dataTable.bodyHeight = 400;
  }

  onSelect({ selected }): void {
    this.selected = [].concat(selected);
  }

  onSelectCheck(row, col, value): boolean {
    return true;
  }

  onActivate(event): void {
    if (event.type === 'dblclick') {
      this.onEdit.emit(event.row);
      // workaround for rows getting unselected on dblclick
      if (!this.selected.find(row => row.$$id === event.row.$$id)) {
        this.selected = this.selected.concat(event.row);
      }
    }
  }

  getRowHeight(row): number {
    return row.height;
  }

}
