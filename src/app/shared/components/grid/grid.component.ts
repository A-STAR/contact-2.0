import {
  AfterViewInit,
  // ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';

import { IDataSource, IParameters, TSelectionType } from './grid.interface';
import { IToolbarAction } from '../toolbar/toolbar.interface';

import { GridService } from './grid.service';
import { SettingsService } from '../../../core/settings/settings.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  // @ViewChild(DatatableComponent) dataTable: DatatableComponent;
  @Input() autoLoad = true;
  @Input() footerHeight = 50;
  @Input() columns: Array<any> = [];
  @Input() columnTranslationKey: string;
  @Input() dataSource: IDataSource;
  @Input() editPermission: string;
  @Input() initialParameters: IParameters;
  @Input() parseFn: Function;
  @Input() rows: Array<any> = [];
  @Input() selectionType: TSelectionType;
  @Input() styles: { [key: string]: any };
  @Input() toolbarActions: IToolbarAction[];
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter();
  @Output() onRowsChange: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  cssClasses: object = {
    sortAscending: 'fa fa-angle-down',
    sortDescending: 'fa fa-angle-up',
    pagerLeftArrow: 'fa fa-angle-left',
    pagerRightArrow: 'fa fa-angle-right',
    pagerPrevious: 'fa fa-angle-double-left',
    pagerNext: 'fa fa-angle-double-right',
  };
  clickDebouncer: Subject<{ type: string; row: any}>;
  debouncerSub: Subscription;
  element: HTMLElement;
  messages: object = {};
  selected: Array<any> = [];
  subscription: EventEmitter<any>;

  @Input() filter(data: Array<any>): Array<any> {
    return data;
  }

  constructor(
    public cdRef: ChangeDetectorRef,
    private gridService: GridService,
    public settings: SettingsService,
    private translate: TranslateService,
  ) {
    this.parseFn = this.parseFn || function (data: any): any { return data; };
    this.clickDebouncer = new Subject();
    this.debouncerSub = this.clickDebouncer
      .debounceTime(150)
      .subscribe(({ type, row }: {type: string; row: any}) => {
        if (type === 'click') {
          this.onSelect.emit(row);
        } else {
          this.onDblClick.emit(row);
        }
      });
  }

  get filteredRows(): Array<any> {
    return (this.rows || []).filter(this.filter);
  }

  get hasToolbar(): boolean {
    return !!this.toolbarActions;
  }

  ngOnInit(): void {
    const gridMessagesKey = 'grid.messages';
    const translationKeys = [gridMessagesKey];
    if (this.autoLoad) {
      this.load(this.initialParameters)
        .take(1)
        .subscribe();
    }

    if (this.columnTranslationKey) {
      translationKeys.push(this.columnTranslationKey);
    }

    this.translate.get(translationKeys)
      .take(1)
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
          const columnTranslations = this.columnTranslationKey
            .split('.')
            .reduce((acc, prop) => acc[prop], translations).grid;
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
    const toolbarHeight = this.hasToolbar ? 50 : 0;
    const offset = 43 + 15 + 15 + toolbarHeight + 8;
    const height = this.settings.getContentHeight() - offset;
    this.dataTableRef.nativeElement.style.height = `${height}px`;
  }

  load(parameters?: IParameters): Observable<any> {
    return this.gridService
      .read(this.dataSource.read, parameters)
      .map(data => this.parseFn(data))
      .do(data => this.updateRows(data));
  }

  update(routeParams: object, body: object): Observable<any> {
    return this.gridService.update(this.dataSource.update, routeParams, body);
  }

  clear(): void {
    this.updateRows([]);
  }

  onActionClick(event: any): void {
    this.onAction.emit(event);
  }

  updateRows(data: any[]): void {
    this.rows = data;
    this.cdRef.detectChanges();
    this.onRowsChange.emit(data);
  }

  onSelectRow(event: any): void {
    this.clickDebouncer.next({ type: 'click', row: event.row });
  }

  onActivate(event: any): void {
    const { row, type } = event;
    if (type === 'dblclick') {
      // TODO(a.tymchuk): yell if there is no edit permission
      // NOTE: workaround for rows getting unselected on dblclick
      if (!this.selected.find(selected => selected.$$id === row.$$id)) {
        this.selected = this.selected.concat(row);
      }
    }
    this.clickDebouncer.next({ type, row });
  }

  // TODO(a.tymchuk): implement when paging is ready
  onPage(event: UIEvent): void {
    // const { count, pageSize, limit, offset } = event;
  }

  getRowHeight(row: any): number {
    return row.height;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.debouncerSub.unsubscribe();
  }

  private translateColumns(columnTranslations: object): void {
    this.columns = this.columns.map(col => {
      col.name = columnTranslations[col.prop];
      return col;
    });
  }
}
