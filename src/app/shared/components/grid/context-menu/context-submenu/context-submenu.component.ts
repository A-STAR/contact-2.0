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

import { IContextMenuItem } from '../../grid.interface';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-context-submenu',
  templateUrl: './context-submenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextSubmenuComponent implements OnInit, OnDestroy {
  @Input() items: IContextMenuItem[];
  @Input() parent: IContextMenuItem;
  @Input() isFieldActionType: boolean;
  @Output() action = new EventEmitter<any>();
  @Output() isHidden = new EventEmitter<any>();

  private parentEnabledSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.parentEnabledSub = this.parent.enabled
      .subscribe(isParentEnabled => {
        const subItems = this.isFieldActionType ? this.parent.fieldActionItems : this.parent.actionItems;
        const isItemsPresent = subItems && !!subItems.length;
        if (!(isItemsPresent && isParentEnabled)) {
          this.hide();
        }
      });
  }

  ngOnDestroy(): void {
    this.cdRef.detach();
    if (this.parentEnabledSub) {
      this.parentEnabledSub.unsubscribe();
    }
  }

  hide(): void {
    this.isHidden.emit({ item: this.parent, isFieldActionType: this.isFieldActionType });
  }

  onAction(item: IContextMenuItem): void {
    this.action.emit(this.isFieldActionType ? this.parent : item);
  }

  isDisabled(item: IContextMenuItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : Observable.of(false);
  }

}
