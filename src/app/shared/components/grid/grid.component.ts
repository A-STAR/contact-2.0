import { Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Input,
  Output } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { IDataSource } from './grid.interface';
import { GridService } from './grid.service';
import { SettingsService } from '../../../core/settings/settings.service';

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

  constructor(private gridService: GridService, public settings: SettingsService) {
    this.parseFn = this.parseFn || function (data) { return data; };
  }

  ngOnInit() {
    if (this.autoLoad) {
      this.load();
    }
  }

  ngAfterViewInit() {
    // set up the height of datatable
    // 43px - tab height, 2x15px - top & bottom padding around the grid
    const offset = 43 + 15 + 15;
    const height = this.settings.getContentHeight() - offset;
    this.dataTableRef.nativeElement.style.height = `${height}px`;
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

  onSelect({ selected }): void {}

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
