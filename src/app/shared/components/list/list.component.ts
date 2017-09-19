import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [ './list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent<T> {
  @Input() items: T[];
  @Input() height = 120;
  @Output() doubleClick = new EventEmitter<T>();

  private _search = '';
  private _selectedId: string = null;

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() getId: (item: T) => string = () => null;
  @Input() getName: (item: T) => string = () => null;

  get filteredItems(): T[] {
    return this.items.filter(item => this.getName(item).includes(this._search));
  }

  get search(): string {
    return this._search;
  }

  get style(): object {
    return {
      height: `${this.height}px`,
      overflow: 'auto'
    };
  }

  getItemClass(item: T): object {
    return {
      'list-group-item p-sm bh0': true,
      'active': this.getId(item) === this._selectedId
    };
  }

  onSearch(value: string): void {
    this._search = value;
    this.cdRef.markForCheck();
  }

  onClick(item: T): void {
    this._selectedId = this.getId(item);
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
