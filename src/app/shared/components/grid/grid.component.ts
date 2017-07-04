import {
  AfterViewInit,
  // ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';

import { IDataSource, IMessages, IParameters, TSelectionType } from './grid.interface';
import { IToolbarAction } from '../toolbar/toolbar.interface';

import { GridService } from './grid.service';
import { SettingsService } from '../../../core/settings/settings.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @Input() autoLoad = true;
  @Input() footerHeight = 50;
  @Input() columns: Array<any> = [];
  @Input() columnTranslationKey: string;
  @Input() dataSource: IDataSource;
  @Input() editPermission: string;
  @Input() emptyMessage: string = null;
  @Input() initialParameters: IParameters;
  @Input() parseFn: Function;
  @Input() rows: Array<any> = [];
  @Input() selectionType: TSelectionType;
  @Input() styles: { [key: string]: any };
  @Input() allowDblClick = true;
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
  messages: IMessages = {};
  selected: Array<any> = [];
  subscription: Subscription;

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
        } else if (this.allowDblClick) {
          this.onDblClick.emit(row);
        }
      });
  }

  get filteredRows(): Array<any> {
    return (this.rows || []).filter(this.filter);
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

    if (this.emptyMessage !== null) {
      translationKeys.push(this.emptyMessage);
    }

    this.subscription = Observable.merge(
      this.translate.get(translationKeys)
        .take(1),
      this.translate.onLangChange
        .map(data => data.translations)
        .map(translations => translationKeys.reduce((acc, key) => {
          acc[key] = key.split('.').reduce((a, prop) => a[prop], translations);
          return acc;
        }, {}))
    ).subscribe(translations => {
      // TODO(d.maltsev):
      // Why `this.messages = translations[gridMessagesKey]` doesn't work?
      this.messages = { ...translations[gridMessagesKey] };
      if (this.columnTranslationKey) {
        this.translateColumns(translations[this.columnTranslationKey].grid);
      }
      if (this.emptyMessage) {
        this.messages.emptyMessage = translations[this.emptyMessage];
      }
    });

    this.selectionType = this.selectionType || 'multi';
  }

  ngOnChanges(changes: any): void {
    if (changes.emptyMessage) {
      if (changes.emptyMessage.currentValue) {
        this.messages.emptyMessage = this.translate.instant(changes.emptyMessage.currentValue);
      } else {
        // TODO(d.maltsev): code duplication
        const gridMessagesKey = 'grid.messages';
        const translationKeys = [gridMessagesKey];
        this.translate.get(translationKeys)
          .take(1)
          .subscribe(translations => this.messages = { ...translations[gridMessagesKey] });
      }
    }
  }

  ngAfterViewInit(): void {
    // Define a possible height of the datatable
    // 43px - tab height,
    // 2x12px - top & bottom padding around the grid
    // 50px - toolbar height
    // 8px => - ?, to be identified
    if (this.styles) {
      // Don't set the full height if the `styles` param is not set
      return;
    }
    const offset = 43 + 12 * 2 + 50;
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
      // NOTE: workaround for rows getting unselected on dblclick
      if (!this.selected.find(selected => selected.$$id === row.$$id)) {
        this.selected = this.selected.concat(row);
      }
    }
    this.clickDebouncer.next({ type, row });
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
