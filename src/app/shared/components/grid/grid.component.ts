import { Component, ElementRef, ViewChild, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { Http } from '@angular/http';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { GridService } from '../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements AfterViewInit {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;
  @Input() columns: Array<any> = [];
  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  element: HTMLElement;
  rows: Array<any> = [];
  selected: Array<any> = [];
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
    this.dataTable.recalculate();
    // this.dataTable.bodyHeight = 400;
  }

  onSelect({ selected }): void {
    // this.selected = [].concat(selected);
    // console.log(this.selected.length);
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

  onPage({ count, pageSize, limit, offset }): void {
    // console.log('offset', offset);
  }

  getRowHeight(row): number {
    return row.height;
  }

}
