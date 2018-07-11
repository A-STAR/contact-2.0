import { Component, Input, Output, EventEmitter, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '@app/core/state/state.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

import { doOnceIf, invert } from '@app/core/utils';

@Component({
  selector: 'app-toolbar-item',
  templateUrl: './toolbar-item.component.html',
  styleUrls: ['./toolbar-item.component.scss'],
})
export class Toolbar2ItemComponent implements OnInit, OnDestroy {
  static ITEM_DEBOUNCE_TIME = 500;

  @Input() item: IToolbarItem;

  @Output() action = new EventEmitter<IToolbarItem>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private click$ = new Subject<IToolbarItem>();
  private clickSub: Subscription;

  constructor(private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.clickSub = this.click$
      .debounceTime(Toolbar2ItemComponent.ITEM_DEBOUNCE_TIME)
      .subscribe(item => doOnceIf(this.isDisabled(item).map(invert), () => {
        if (typeof item.action === 'function') {
          item.action();
        } else if (item.action) {
          this.store.dispatch(item.action);
        }
        this.action.emit(item);
      }));
  }

  ngOnDestroy(): void {
    this.clickSub.unsubscribe();
  }

  onClick(item: IToolbarItem): void {
    this.click$.next(item);
  }

  onDropdownItemClick(item: IToolbarItem): void {
    this.dropdown.close();
    this.onClick(item);
  }

  isDisabled(item: IToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }
}
