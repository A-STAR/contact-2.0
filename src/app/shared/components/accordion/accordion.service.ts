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
    // The duplication here is necessary
    // If we hide currentItem first, `item !== this.currentItem` will always be true
    if (item !== this.currentItem) {
      this.hideItem(this.currentItem);
      this.showItem(item);
    } else {
      this.hideItem(this.currentItem);
    }
  }

  prev(): void {
    if (this.prevItem) {
      this.hideItem(this.currentItem);
      this.showItem(this.prevItem);
    }
  }

  next(): void {
    if (this.nextItem) {
      this.hideItem(this.currentItem);
      this.showItem(this.nextItem);
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
