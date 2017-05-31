import { Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';

import { IDataSource, IParameters, TSelectionType } from './grid.interface';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { GridService } from './grid.service';
import { IToolbarAction } from '../toolbar/toolbar.interface';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;
  @Input() autoLoad = true;
  @Input() footerHeight = 50;
  @Input() bottomActions: IToolbarAction[];
  @Input() columns: Array<any> = [];
  @Input() dataSource: IDataSource;
  @Input() rows: Array<any> = [];
  @Input() editPermission;
  @Input() initialParameters: IParameters;
  @Input() parseFn: Function;
  @Input() selectionType: TSelectionType;
  @Input() styles: { [key: string]: any };
  @Input() columnTranslationKey: string;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
  @Output() onRowsChange: EventEmitter<any> = new EventEmitter();
  @Output() onRowDoubleSelect: EventEmitter<any> = new EventEmitter();

  cssClasses: object = {
    sortAscending: 'fa fa-angle-down',
    sortDescending: 'fa fa-angle-up',
    pagerLeftArrow: 'fa fa-angle-left',
    pagerRightArrow: 'fa fa-angle-right',
    pagerPrevious: 'fa fa-angle-double-left',
    pagerNext: 'fa fa-angle-double-right',
  };
  element: HTMLElement;
  messages: object = {};
  selected: Array<any> = [];
  subscription: EventEmitter<any>;

  constructor(
    private gridService: GridService,
    public settings: SettingsService,
    private translate: TranslateService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.parseFn = this.parseFn || function (data: any): any { return data; };
  }

  @Input() filter(data: Array<any>): Array<any> {
    return data;
  }

  get filteredRows(): Array<any> {
    return (this.rows || []).filter(this.filter);
  }

  get hasToolbar(): boolean {
    return !!this.bottomActions;
  }

  ngOnInit(): void {
    const gridMessagesKey = 'grid.messages';
    const translationKeys = [gridMessagesKey];
    if (this.autoLoad) {
      this.load(this.initialParameters).subscribe();
    }
    if (this.columnTranslationKey) {
      translationKeys.push(this.columnTranslationKey);
    }
    this.translate.get(translationKeys)
      .subscribe(
        (translation) => {
          this.messages = translation[gridMessagesKey];
          if (this.columnTranslationKey) {
            this.translateColumns(translation[this.columnTranslationKey].grid);
          }
        },
        // TODO: log out the error
        error => console.error(error)
      );

    this.selectionType = this.selectionType || 'multi';

    this.subscription = this.translate.onLangChange
      .subscribe(event => {
        const { translations } = event;
        this.messages = translations.grid.messages;
        // translate column names
        if (this.columnTranslationKey) {
          // IMPORTANT: the key 'grid' should be present in translation files for every grid component
          const columnTranslations = this.columnTranslationKey.split('.').reduce((acc, prop) => acc[prop], translations).grid;
          this.translateColumns(columnTranslations);
        }
      });
  }

  ngAfterViewInit(): void {
    // Define a possible height of the datatable
    // 43px - tab height,
    // 2x15px - top & bottom padding around the grid
    // 50px - toolbar height
    // 8px => - ?, to be identified
    if (this.styles) {
      // Don't set the full height if the `styles` param is not set
      return;
    }
    const offset = 43 + 15 + 15 + 50 + 8;
    const height = this.settings.getContentHeight() - offset;
    this.dataTableRef.nativeElement.style.height = `${height}px`;
  }

  load(parameters?: IParameters): Observable<any> {
    return this.gridService
      .read(this.dataSource.read, parameters)
      .map(data => this.parseFn(data))
      .do(data => this.updateRows(data))
      .catch(err => {
        // TODO: gisplay message & log
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
    this.updateRows([]);
  }

  onActionClick(event: any): void {
    this.onAction.emit(event);
  }

  updateRows(data: any[]): void {
    this.rows = data;
    this.onRowsChange.emit(data);
  }

  onActivate(event: any): void {
    if (event.type === 'dblclick') {
      if (this.editPermission && !this.userPermissionsService.hasPermission(this.editPermission)) {
        return;
      }
      const { row } = event;
      this.onEdit.emit(row);
      // workaround for rows getting unselected on dblclick
      if (!this.selected.find(selected => selected.$$id === row.$$id)) {
        this.selected = this.selected.concat(row);
      }
      this.onRowDoubleSelect.emit(this.selected);
    }
  }

  // TODO: implement when paging is ready
  onPage(event: UIEvent): void {
    // const { count, pageSize, limit, offset } = event;
  }

  getRowHeight(row: any): number {
    return row.height;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private translateColumns(columnTranslations: object): void {
    this.columns = this.columns.map(col => {
      col.name = columnTranslations[col.prop];
      return col;
    });
  }
}
