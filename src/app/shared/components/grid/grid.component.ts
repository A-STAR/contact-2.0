import { Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Input,
  Output } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { GridService } from '../../../shared/components/grid/grid.service';

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
    this.parseFn = this.parseFn || function (data) { return data; };
  }

  ngOnInit() {
    if (this.autoLoad) {
      this.load();
    }
  }

  ngAfterViewInit() {
    // set up the height of datatable - it does not work with height specified
    const height = this.element.offsetHeight;
    // this.dataTableRef.nativeElement.style.height = `${height}px`;
    // this.dataTable.recalculate();
    // this.dataTable.bodyHeight = 400;
  }

  load() {
    this.gridService
      .read(this.dataSource.read)
      .then(data => this.rows = this.parseFn(data))
      .catch(err => console.error(err));
  }

  update(routeParams: object, body: object) {
    return this.gridService.update(this.dataSource.update, routeParams, body);
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
