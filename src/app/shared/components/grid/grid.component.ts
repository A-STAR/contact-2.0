import { Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Input,
  Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';
import { IDataSource, TSelectionType } from './grid.interface';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { SettingsService } from '../../../core/settings/settings.service';
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
  @Input() selectionType: TSelectionType;
  @Input() autoLoad = true;
  @Input() editPermission;
  @Input() parseFn: Function;
  @Input() columns: Array<any> = [];
  @Input() dataSource: IDataSource;
  @Input() styles: { [key: string]: any };
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
  messages: object = {};

  constructor(
    private gridService: GridService,
    public settings: SettingsService,
    private translate: TranslateService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.parseFn = this.parseFn || function (data: any): any { return data; };
    this.translate.get('grid.messages')
      .subscribe(
        messages => this.messages = messages,
        error => console.error(error)
      );
  }

  ngOnInit() {
    if (this.autoLoad) {
      this.load(this.initialParameters).subscribe();
    }
    this.selectionType = this.selectionType || 'multi';
  }

  ngAfterViewInit() {
    // Define a possible height of the datatable
    // 43px - tab height,
    // 2x15px - top & bottom padding around the grid
    // 8px => - to be examined ?
    if (this.styles) {
      // Don't set the full height if the `styles` param is not set
      return;
    }
    const offset = 43 + 15 + 15 + 8;
    const height = this.settings.getContentHeight() - offset;
    this.dataTableRef.nativeElement.style.height = `${height}px`;
  }

  load(parameters?: IParameters): Observable<any> {
    return this.gridService
      .read(this.dataSource.read, parameters)
      .map(data => this.parseFn(data))
      .do(data => this.rows = data)
      .catch(err => {
        console.error(err);
        throw new Error(err);
      });
  }

  update(routeParams: object, body: object): Observable<any> {
    return this.gridService.update(this.dataSource.update, routeParams, body);
  }

  onSelect(event: any): void {
    this.onRowSelect.emit(event.selected);
  }

  clear(): void {
    this.rows = [];
  }

  onActionClick(event: any): void {
    this.onAction.emit(event);
  }

  findRowById(id: number): any {
    return this.rows.find((item: { id: number }) => item.id === id);
  }

  removeRowById(id: number): void {
    const index: number = this.rows.findIndex((item: { id: number }) => item.id === id);
    this.rows.splice(index, 1);
  }

  onActivate(event: any): void {
    if (event.type === 'dblclick') {
      if (this.editPermission && !this.userPermissionsService.hasPermission(this.editPermission)) {
        return;
      }
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

  getRowHeight(row: any): number {
    return row.height;
  }

}
