import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-single-list',
  templateUrl: './single-list.component.html',
  styleUrls: [ './single-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleListComponent<T> {
  @Input() items: T[];
  @Input() height = 120;
  @Input() hideSearchBar = false;
  @Output() doubleClick = new EventEmitter<T>();
  @Output() select = new EventEmitter<T>();

  private _search = '';
  private _selectedId: string = null;

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() getId: (item: T) => string = () => null;
  @Input() getName: (item: T) => string = () => null;

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
      'active': this.getId(item) === this._selectedId
    };
  }

  onSearch(value: string): void {
    this._search = value.toLowerCase();
    this.cdRef.markForCheck();
  }

  onClick(item: T): void {
    this._selectedId = this.getId(item);
    this.select.emit(item);
    this.cdRef.markForCheck();
  }

  onDblClick(item: T): void {
    this.doubleClick.emit(item);
    this.cdRef.markForCheck();
  }

  trackByFn(index: number): number {
    return index;
  }
}
