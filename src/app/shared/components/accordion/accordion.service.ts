import { Injectable, QueryList } from '@angular/core';

import { AccordionItemComponent } from './item/item.component';

@Injectable()
export class AccordionService {
  private _items: QueryList<AccordionItemComponent>;

  set items(items: QueryList<AccordionItemComponent>) {
    this._items = items;
    this.showItem(this._items.first);
  }

  toggle(item: AccordionItemComponent): void {
    const currentItem = this.currentItem;
    this.hideItem(currentItem);
    if (item !== currentItem) {
      this.showItem(item);
    }
  }

  prev(): void {
    const currentItem = this.currentItem;
    const prevItem = this.prevItem;
    if (prevItem) {
      this.hideItem(currentItem);
      this.showItem(prevItem);
    }
  }

  next(): void {
    const currentItem = this.currentItem;
    const nextItem = this.nextItem;
    if (nextItem) {
      this.hideItem(currentItem);
      this.showItem(nextItem);
    }
  }

  private showItem(item: AccordionItemComponent): void {
    if (item) {
      item.display = true;
    }
  }

  private hideItem(item: AccordionItemComponent): void {
    if (item) {
      item.display = false;
    }
  }

  private get currentItem(): AccordionItemComponent {
    return this.itemsAsArray[this.currentItemIndex];
  }

  private get prevItem(): AccordionItemComponent {
    return this.itemsAsArray[this.currentItemIndex - 1];
  }

  private get nextItem(): AccordionItemComponent {
    return this.itemsAsArray[this.currentItemIndex + 1];
  }

  private get currentItemIndex(): number {
    return this.itemsAsArray.findIndex(item => item.display);
  }

  private get itemsAsArray(): AccordionItemComponent[] {
    return this._items.toArray();
  }
}
