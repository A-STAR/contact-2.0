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
  Optional,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';
import { SplitComponent } from 'angular-split';

import { IContextMenuItem } from './grid.interface';
import { IMessages, TSelectionType, IGridColumn } from './grid.interface';

import { SettingsService } from '../../../core/settings/settings.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html',
})
export class GridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(DatatableComponent, {read: ElementRef}) dataTableRef: ElementRef;
  @ViewChild(DatatableComponent) dataTable: DatatableComponent;

  @Input() allowDblClick = true;
  @Input() footerHeight = 50;
  @Input() columns: IGridColumn[] = [];
  @Input() columnTranslationKey: string;
  @Input() contextMenuOptions: IContextMenuItem[] = [];
  @Input() emptyMessage: string = null;
  @Input() parseFn: Function;
  @Input() rowIdKey = 'id';
  @Input() rows: Array<any> = [];
  @Input() selection: Array<any> = [];
  @Input() selectionType: TSelectionType = 'multi';
  @Input() styles: { [key: string]: any };

  @Output() action = new EventEmitter<any>();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  contextFieldName: string;
  clickDebouncer: Subject<{ type: string; row: any}>;
  columnDefs: IGridColumn[];
  // Context Menu
  ctxColumn: any;
  ctxFieldNameTranslation: { field: string };
  ctxRow: any;
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

  // a cache to prevent select from firing on already selected row
  debouncerSub: Subscription;
  element: HTMLElement;
  messages: IMessages = {};
  selected: Array<any> = [];
  subscription: Subscription;
  resizeSubscription: Subscription;

  private _selected: any = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    public settings: SettingsService,
    @Optional() private split: SplitComponent,
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

  @Input() filter = (row: object) => true;

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

    const ctxMenuFieldAction = this.contextMenuOptions.find(option => !!option.simpleActionsNames);

    this.contextFieldName = ctxMenuFieldAction && ctxMenuFieldAction.prop;

    this.ctxFieldNameTranslation = {
      field: this.contextFieldName ? this.translate.instant(this.contextFieldName) : this.contextFieldName
    };


    if (this.columnTranslationKey) {
      translationKeys.push(this.columnTranslationKey);
    }

    if (this.emptyMessage !== null) {
      translationKeys.push(this.emptyMessage);
    }

    this.subscription = merge(
      this.translate.get(translationKeys).pipe(first()),
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
          if (this.contextMenuOptions.length) {
            this.ctxFieldNameTranslation = {
              field: translations[this.columnTranslationKey].grid[this.contextFieldName] || this.contextFieldName
            };
          }
        }
        if (this.emptyMessage) {
          this.messages.emptyMessage = translations[this.emptyMessage];
        }
        this.cdRef.markForCheck();
      },
      error => console.error(error)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { emptyMessage, selection, rows } = changes;
    if (emptyMessage) {
      if (emptyMessage.currentValue) {
        this.messages.emptyMessage = this.translate.instant(emptyMessage.currentValue);
      } else {
        const gridMessagesKey = 'grid.messages';
        this.translate.get([gridMessagesKey])
          .pipe(first())
          .subscribe(translations => this.messages = { ...translations[gridMessagesKey] });
      }
    }

    if (selection) {
      this.setSelectedRows(selection.currentValue);
    }

    if (rows) {
      this._selected = [];
      this.cdRef.markForCheck();
      this.dataTable.recalculate();
    }
  }

  ngAfterViewInit(): void {
    if (this.contextMenuOptions.length) {
      this.ctxOutsideListener = this.renderer.listen('document', 'click', this.onDocumentClick);
    }

    if (this.styles) {
      if (this.styles.height === 'auto') {
        // TODO(d.maltsev): this is horrible, but nothing else seems to work
        setTimeout(() => this.setFullHeight(), 0);
        if (this.split) {
          this.resizeSubscription = merge(this.split.dragEnd, this.split.dragProgress)
            .subscribe(() => this.setFullHeight());
        }
      }
    } else {
      // Define a possible height of the datatable
      // 43px - tab height,
      // 2x12px - top & bottom padding around the grid
      // 50px - toolbar height
      // 8px => - ?, to be identified
      const offset = 49 + 7 * 2 + 50;
      const height = this.settings.getContentHeight() - offset;
      this.dataTableRef.nativeElement.style.height = `${height}px`;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.debouncerSub.unsubscribe();
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.ctxOutsideListener) {
      this.ctxOutsideListener();
    }
  }

  getSelectedRows(): Array<any> {
    return this.selected;
  }

  setSelectedRows(selection: Array<any>): void {
    this.selected = selection ? [...selection] : [];
  }

  // NOTE: now own, the grid's function
  onSelectRow(event: any): void {
    const { selected } = event;
    const rowSelected = this._selected[0];
    if (!(rowSelected && selected[0] && rowSelected[this.rowIdKey] === selected[0][this.rowIdKey])) {
      const row = this.selectionType === 'single' ? selected[0] : selected;
      this.clickDebouncer.next({ type: 'select', row });
    }
    this._selected = [].concat(selected);
  }

  // NOTE: now own, the grid's function
  onActivate(event: any): void {
    const { row, type, event: e } = event;
    if (type === 'dblclick') {
      this.clickDebouncer.next({ type, row });
    }
    if (type === 'keydown' && e.keyCode === 13) {
      this.clickDebouncer.next({ type: 'select', row });
    }
  }

  // NOTE: now own, the grid's function
  onTableContextMenu(ctxEvent: any): void {
    ctxEvent.event.preventDefault();
    ctxEvent.event.stopPropagation();

    if (!this.contextMenuOptions.length || !this._selected.length) {
      return;
    }

    this.ctxEvent = ctxEvent.event;

    if (ctxEvent.type === 'body') {
      this.ctxRow = ctxEvent.content;
      this.ctxColumn = undefined;
      this.showCtxMenu();
      const { x, y } = this.ctxEvent;
      // position ctx menu relative to datatable
      this.ctxStyles = this.computeCtxMenuStyles(x, y);
      this.cdRef.detectChanges();
    } else {
      // Should you need to hook to the column header click, uncomment the next line
      // this.ctxColumn = ctxEvent.content;
      this.ctxRow = undefined;
    }
  }

  onAction(action: IContextMenuItem): void {
    this.hideCtxMenu();
    this.action.emit(action);
  }

  clearSelection(): void {
    this.selected = [];
  }

  private onDocumentClick(event: MouseEvent): void {
    if (this.ctxShowMenu) {
      this.hideCtxMenu();
    }
  }

  private showCtxMenu(): void {
    this.ctxShowMenu = true;
  }

  private hideCtxMenu(): void {
    this.ctxShowMenu = false;
    this.cdRef.markForCheck();
  }

  private computeCtxMenuStyles(eventX: number, eventY: number): { left: string, top: string } {
    const dataTableClientRect = this.dataTableRef.nativeElement.getBoundingClientRect();
    // compute datatable position relative to window
    const dataTablePosition = {
      top: dataTableClientRect.top + this.dataTableRef.nativeElement.clientTop,
      left: dataTableClientRect.left + this.dataTableRef.nativeElement.clientLeft
    };
    return { left: (eventX - dataTablePosition.left) + 'px', top: (eventY - dataTablePosition.top) + 'px' };
  }

  private translateColumns(columnTranslations: object): void {
    this.columnDefs = this.columnDefs.map(col => {
      col.name = columnTranslations[col.prop];
      return col;
    });
  }

  private setFullHeight(): void {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    this.dataTableRef.nativeElement.style.height = `${rect.height}px`;
    this.cdRef.markForCheck();
  }
}
