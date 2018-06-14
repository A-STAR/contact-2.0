import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
  IMapToolbarFilterItem,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';
import { IMapFilterItemAction } from '@app/shared/components/map/components/controls/filter/map-filter.interface';

import { MenuSelectComponent } from '@app/shared/components/menu/menu-select/menu-select.component';
import { TickComponent } from '@app/shared/components/form/check/tick/tick.component';

@Component({
  selector: 'app-map-filter-item',
  templateUrl: './map-filter-item.component.html',
  styleUrls: ['./map-filter-item.component.scss']
})
export class MapFilterItemComponent implements OnInit {
  @ViewChild(MenuSelectComponent) menuSelect: MenuSelectComponent;
  @ViewChild(TickComponent) tickCmp: TickComponent;

  @Input() config: IMapToolbarFilterItem;
  @Output() action = new EventEmitter<IMapFilterItemAction>();

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  changeValue(value: any): void {
    if (this.menuSelect) {
      value ? this.menuSelect.selectAll() : this.menuSelect.deselectAll();
    }
    if (this.tickCmp) {
      this.config.checked = value;
    }
    // something else

    this.cdRef.markForCheck();
  }

  onAction(value: any): void {
    this.action.emit({ value, item: this.config });
  }

  isDisabled(item: IMapToolbarFilterItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

}
