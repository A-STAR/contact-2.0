import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';

import { IMessages, TSelectionType, IGridColumn } from './grid.interface';

import { SettingsService } from '../../../core/settings/settings.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;
  @Input() allowDblClick = true;
  @Input() footerHeight = 50;
  @Input() columns: IGridColumn[] = [];
  @Input() columnTranslationKey: string;
  @Input() emptyMessage: string = null;
  @Input() parseFn: Function;
  @Input() rows: Array<any> = [];
  @Input() selection: Array<any> = [];
  @Input() selectionType: TSelectionType = 'multi';
  @Input() styles: { [key: string]: any };
  @Input() contextMenuEnabled = false;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  clickDebouncer: Subject<{ type: string; row: any}>;
  columnDefs: IGridColumn[];
  // Context Menu
  ctxRow: any;
  ctxColumn: any;
  ctxEvent: MouseEvent;
  ctxOutsideListener: Function;
  ctxShowMenu = false;
  ctxStyles: any;

  cssClasses: object = {
    sortAscending: 'fa fa-angle-down',
    sortDescending: 'fa fa-angle-up',
    pagerLeftArrow: 'fa fa-angle-left',
    pagerRightArrow: 'fa fa-angle-right',
    pagerPrevious: 'fa fa-angle-double-left',
    pagerNext: 'fa fa-angle-double-right',
  };

  debouncerSub: Subscription;
  element: HTMLElement;
  messages: IMessages = {};
  selected: Array<any> = [];
  // a cache to prevent select from firing on already selected row
  subscription: Subscription;

  private _selected: any = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    public settings: SettingsService,
    private translate: TranslateService,
  ) {
    this.parseFn = this.parseFn || function (data: any): any { return data; };
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.clickDebouncer = new Subject();
    this.debouncerSub = this.clickDebouncer
      .debounceTime(100)
      .subscribe(({ type, row }: {type: string; row: any}) => {
        if (type === 'select') {
          this.onSelect.emit(row);
        } else if (type === 'dblclick' && this.allowDblClick) {
          this.onDblClick.emit(row);
        }
      });
  }

  @Input() rowClass = () => undefined;

  @Input() filter(data: Array<any>): Array<any> {
    return data;
  }

  get filteredRows(): Array<any> {
    return (this.rows || []).filter(this.filter);
  }

  get hasSingleSelection(): boolean {
    return this._selected.length === 1;
  }

  ngOnInit(): void {
    const gridMessagesKey = 'grid.messages';
    const translationKeys = [gridMessagesKey];

    this.columnDefs = [].concat(this.columns);

    if (this.columnTranslationKey) {
      translationKeys.push(this.columnTranslationKey);
    }

    if (this.emptyMessage !== null) {
      translationKeys.push(this.emptyMessage);
    }

    this.subscription = Observable.merge(
      this.translate.get(translationKeys).take(1),
      this.translate.onLangChange
        .map(data => data.translations)
        .map(translations => translationKeys.reduce((acc, key) => {
          acc[key] = key.split('.').reduce((a, prop) => a[prop], translations);
          return acc;
        }, {}))
    )
    .subscribe(
      translations => {
        this.messages = { ...translations[gridMessagesKey] };
        if (this.columnTranslationKey) {
          this.translateColumns(translations[this.columnTranslationKey].grid);
        }
        if (this.emptyMessage) {
          this.messages.emptyMessage = translations[this.emptyMessage];
        }
        this.cdRef.markForCheck();
      },
      error => console.log(error)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { emptyMessage, selection, rows } = changes;
    if (emptyMessage) {
      if (emptyMessage.currentValue) {
        this.messages.emptyMessage = this.translate.instant(emptyMessage.currentValue);
      } else {
        // TODO(d.maltsev): code duplication
        const gridMessagesKey = 'grid.messages';
        const translationKeys = [gridMessagesKey];
        this.translate.get(translationKeys)
          .take(1)
          .subscribe(translations => this.messages = { ...translations[gridMessagesKey] });
      }
    }
    if (selection) {
      this.selected = [...selection.currentValue];
    }
    if (rows) {
      this._selected = [];
      this.cdRef.markForCheck();
      this.dataTable.recalculate();
    }
  }

  ngAfterViewInit(): void {
    if (this.contextMenuEnabled) {
      this.ctxOutsideListener = this.renderer.listen('document', 'click', this.onDocumentClick);
    }
    // Define a possible height of the datatable
    // 43px - tab height,
    // 2x12px - top & bottom padding around the grid
    // 50px - toolbar height
    // 8px => - ?, to be identified
    if (this.styles) {
      // Don't calculate the full height if the `styles` param is set
      return;
    }
    const offset = 43 + 12 * 2 + 50;
    const height = this.settings.getContentHeight() - offset;
    this.dataTableRef.nativeElement.style.height = `${height}px`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.debouncerSub.unsubscribe();
    if (this.ctxOutsideListener) {
      this.ctxOutsideListener();
    }
  }

  onActionClick(event: any): void {
    this.onAction.emit(event);
  }

  onSelectRow(event: any): void {
    const { selected } = event;
    const rowSelected = this._selected[0];
    if (!rowSelected || rowSelected.id !== selected[0].id) {
      const row = this.selectionType === 'single' ? selected[0] : selected;
      this.clickDebouncer.next({ type: 'select', row });
    }
    this._selected = [].concat(selected);
  }

  onActivate(event: any): void {
    const { row, type, event: e } = event;
    if (type === 'dblclick') {
      this.clickDebouncer.next({ type, row });
    }
    if (type === 'keydown' && e.keyCode === 13) {
      this.clickDebouncer.next({ type: 'select', row });
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.ctxShowMenu) {
      this.hideCtxMenu();
    }
  }

  onTableContextMenu(ctxEvent: any): void {
    ctxEvent.event.preventDefault();
    ctxEvent.event.stopPropagation();

    if (!this.contextMenuEnabled || !this.hasSingleSelection) {
      return;
    }

    this.ctxEvent = ctxEvent.event;

    if (ctxEvent.type === 'body') {
      this.ctxRow = ctxEvent.content;
      this.ctxColumn = undefined;
      this.showCtxMenu();
      const { x, y } = this.ctxEvent;
      this.ctxStyles = { left: x + 'px', top: y + 'px' };
    } else {
      // Should you need to hook to the column header click, uncomment the next line
      // this.ctxColumn = ctxEvent.content;
      this.ctxRow = undefined;
    }
  }

  onCtxMenuClick(event: MouseEvent, prop: string): void {
    const data = prop ? this.ctxRow[prop] : this.ctxRow;
    const copyAsPlaintext = (content) => {
      const copyFrom = document.createElement('textarea');
      copyFrom.textContent = content;
      const body = document.querySelector('body');
      body.appendChild(copyFrom);
      copyFrom.select();

      document.execCommand('copy');
      body.removeChild(copyFrom);
    }

    const formattedData = prop
      ? data
      : this.columns
          .filter(column => data[column.prop] !== null)
          .map(column => {
            return column.type === 'boolean'
              ? Boolean(data[column.prop])
              : column.$$valueGetter && column.dictCode
                ? column.$$valueGetter(data, column.prop)
                : data[column.prop];
          })
          .join('\t');

    copyAsPlaintext(formattedData);
    this.hideCtxMenu();
  }

  hideCtxMenu(): void {
    this.ctxShowMenu = false;
    this.cdRef.markForCheck();
  }

  showCtxMenu(): void {
    this.ctxShowMenu = true;
  }

  getRowHeight(row: any): number {
    return row.height;
  }

  clearSelection(): void {
    this.selected = [];
  }

  private translateColumns(columnTranslations: object): void {
    this.columnDefs = this.columnDefs.map(col => {
      col.name = columnTranslations[col.prop];
      return col;
    });
  }
}
