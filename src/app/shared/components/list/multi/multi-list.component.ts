import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multi-list',
  templateUrl: './multi-list.component.html',
  styleUrls: [ './multi-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiListComponent<T> {
  @Input() items: T[];
  @Input() height = 120;
  @Input() hideSearchBar = false;
  @Output() doubleClick = new EventEmitter<T>();
  @Output() select = new EventEmitter<T[]>();

  private _search = '';
  private _selection: (number|string)[] = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() getId: (item: T) => number|string = () => null;
  @Input() getName: (item: T) => string = () => null;

  get selection(): (number|string)[] {
    return this._selection;
  }

  set selection(selection: (number|string)[]) {
    this._selection = selection;
    this.cdRef.markForCheck();
  }

  get filteredItems(): T[] {
    return (this.items || []).filter(item => this.getName(item).toLowerCase().includes(this._search));
  }

  get search(): string {
    return this._search;
  }

  get style(): object {
    return {
      maxHeight: `${this.height}px`,
      overflow: 'auto'
    };
  }

  getItemClass(item: T): object {
    return {
      'list-group-item p-sm b0': true,
      'active': this.selectionContains(item)
    };
  }

  onSearch(value: string): void {
    this._search = value.toLowerCase();
    this.cdRef.markForCheck();
  }

  onClick(item: T): void {
    this._selection = this.selectionContains(item)
      ? this._selection.filter(id => id !== this.getId(item))
      : [ ...this._selection, this.getId(item) ];
    const selectedItems = this.items.filter(i => this.selectionContains(i));
    this.select.emit(selectedItems);
    this.cdRef.markForCheck();
  }

  onDblClick(item: T): void {
    this.doubleClick.emit(item);
    this.cdRef.markForCheck();
  }

  trackByFn(index: number): number {
    return index;
  }

  private selectionContains(item: T): boolean {
    return this._selection.includes(this.getId(item));
  }
}
