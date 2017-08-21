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
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  columnDefs: IGridColumn[];
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
  // a cache to prevent select from firing on already selected row
  subscription: Subscription;

  private _selected: any = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    public settings: SettingsService,
    private translate: TranslateService,
  ) {
    this.parseFn = this.parseFn || function (data: any): any { return data; };
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
    ).subscribe(translations => {
      this.messages = { ...translations[gridMessagesKey] };
      if (this.columnTranslationKey) {
        this.translateColumns(translations[this.columnTranslationKey].grid);
      }
      if (this.emptyMessage) {
        this.messages.emptyMessage = translations[this.emptyMessage];
      }
      this.cdRef.markForCheck();
    });
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
