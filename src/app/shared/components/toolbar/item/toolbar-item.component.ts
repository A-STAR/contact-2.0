import { Component, Input, Output, EventEmitter, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '@app/core/state/state.interface';
import { ToolbarItem } from '../toolbar.interface';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

import { doOnceIf, invert } from '@app/core/utils';

@Component({
  selector: 'app-toolbar-item',
  templateUrl: './toolbar-item.component.html',
  styleUrls: ['./toolbar-item.component.scss'],
})
export class ToolbarItemComponent implements OnInit, OnDestroy {
  static ITEM_DEBOUNCE_TIME = 500;

  @Input() item: ToolbarItem;

  @Output() action = new EventEmitter<ToolbarItem>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private click$ = new Subject<ToolbarItem>();
  private clickSub: Subscription;

  constructor(private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.clickSub = this.click$
      .debounceTime(ToolbarItemComponent.ITEM_DEBOUNCE_TIME)
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

  onClick(item: ToolbarItem): void {
    this.click$.next(item);
  }

  onDropdownItemClick(item: ToolbarItem): void {
    this.dropdown.close();
    this.onClick(item);
  }

  isDisabled(item: ToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  /**
   * Get the icon's css class, or show an exclamation if the icon class is not listed
   * @param item {ITitlebarButton}
   */
  // getIconCls(item: ITitlebarButton): object {
  //   const iconCls = this.buttonService.getIcon(item.buttonType) || 'co-dialog-exclamation';
  //   const cls = { 'align-right': item.align === 'right' };
  //   return iconCls
  //     ? { ...cls, [iconCls]: true }
  //     : cls;
  // }

  // getLabel(item: ITitlebarButton): string {
  //   return this.buttonService.getLabel(item.buttonType) || null;
  // }
}
