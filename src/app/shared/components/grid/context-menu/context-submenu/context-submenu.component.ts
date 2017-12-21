import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IContextMenuItem } from '../../grid.interface';

@Component({
  selector: 'app-context-submenu',
  templateUrl: './context-submenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextSubmenuComponent implements OnInit, OnDestroy {
  @Input() parent: IContextMenuItem;
  @Output() action = new EventEmitter<any>();
  @Output() simpleAction = new EventEmitter<any>();

  isSubmenuShown: boolean;
  isActionsShown: boolean;
  isSimpleActionsShown: boolean;

  private parentEnabledSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.parentEnabledSub = Observable.combineLatest(
      this.parent.enabled,
      this.isActionsDisabled(this.concatAllItems(this.parent.actions, this.parent.simpleActions))
    )
      .subscribe(([isParentEnabled, isActionsDisabled]) => {

        this.isSubmenuShown = isParentEnabled && !isActionsDisabled && (this.hasItems(this.parent.actions)
          || this.hasItems(this.parent.simpleActions));

        this.isActionsShown = isParentEnabled && this.hasItems(this.parent.actions);

        this.isSimpleActionsShown = isParentEnabled && this.hasItems(this.parent.simpleActions);

        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.parentEnabledSub) {
      this.parentEnabledSub.unsubscribe();
    }
  }

  onAction(item: IContextMenuItem): void {
    this.action.emit(item);
  }

  onSimpleAction(): void {
    this.simpleAction.emit(this.parent);
  }

  isDisabled(item: IContextMenuItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : Observable.of(false);
  }

  private isActionsDisabled(items: IContextMenuItem[]): Observable<boolean>  {
    return Observable.combineLatest(items.map(item => item.enabled))
      .map(results => !results.some(Boolean));
  }

  private concatAllItems(...items: IContextMenuItem[][]): IContextMenuItem[] {
    return items.reduce((acc, i) => {
      if (this.hasItems(i)) {
        acc = acc.concat(i);
      }
      return acc;
    }, []);
  }

  private hasItems(items: IContextMenuItem[]): boolean {
    return !!(items && items.length);
  }

}
