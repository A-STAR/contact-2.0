import { Injectable, QueryList } from '@angular/core';

import { Accordion2ItemComponent } from './item/item.component';

@Injectable()
export class Accordion2Service {
  private _items: QueryList<Accordion2ItemComponent>;

  set items(items: QueryList<Accordion2ItemComponent>) {
    this._items = items;
    this._items.first.display = true;
  }

  toggle(item: Accordion2ItemComponent): void {
    this.currentItem.display = false;
    if (item !== this.currentItem) {
      item.display = true;
    }
  }

  prev(): void {
    if (this.prevItem) {
      this.currentItem.display = false;
      this.prevItem.display = true;
    }
  }

  next(): void {
    if (this.nextItem) {
      this.currentItem.display = false;
      this.nextItem.display = true;
    }
  }

  private get currentItem(): Accordion2ItemComponent {
    return this.itemsAsArray[this.currentItemIndex];
  }

  private get prevItem(): Accordion2ItemComponent {
    return this.itemsAsArray[this.currentItemIndex - 1];
  }

  private get nextItem(): Accordion2ItemComponent {
    return this.itemsAsArray[this.currentItemIndex + 1];
  }

  private get currentItemIndex(): number {
    return this.itemsAsArray.findIndex(item => item.display);
  }

  private get itemsAsArray(): Accordion2ItemComponent[] {
    return this._items.toArray();
  }
}
