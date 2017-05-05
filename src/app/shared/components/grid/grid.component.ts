import { Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Input,
  Output } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as format from 'string-format';

import { IDataSource } from './grid.interface';
import { GridService } from './grid.service';
import { IToolbarAction } from '../toolbar/toolbar.interface';

interface IParameters {
  [index: string]: any;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, AfterViewInit {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;
  @Input() autoLoad = true;
  @Input() parseFn: Function;
  @Input() columns: Array<any> = [];
  @Input() dataSource: IDataSource;
  @Input() selectionType: string;
  @Input() innerStyles;
  @Input() initialParameters: IParameters;
  @Input() bottomActions: IToolbarAction[];
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
  @Output() onAction: EventEmitter<any> = new EventEmitter();

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
    this.parseFn = this.parseFn || function (data) { return data; };
  }

  ngOnInit() {
    if (this.autoLoad) {
      this.load(this.initialParameters);
    }
    this.selectionType = this.selectionType || 'multiClick';
  }

  ngAfterViewInit() {
    // set up the height of datatable - it does not work with height specified
    const height = this.element.offsetHeight;
    // this.dataTableRef.nativeElement.style.height = `${height}px`;
    // this.dataTable.recalculate();
    // this.dataTable.bodyHeight = 400;
  }

  load(parameters?: IParameters): Promise<any> {
    return this.gridService
      .read(format(this.dataSource.read, parameters || {}))
      .then(data => this.rows = this.parseFn(data))
      .catch(err => console.error(err));
  }

  update(key: string | number, body: object) {
    return this.gridService.update(this.dataSource.update, key, body);
  }

  onSelect({ selected }): void {
    this.onRowSelect.emit(selected);
    // this.selected = [].concat(selected);
    // console.log(this.selected.length);
  }

  onSelectCheck(row, col, value): boolean {
    return true;
  }

  onActionClick(event) {
    this.onAction.emit(event);
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
