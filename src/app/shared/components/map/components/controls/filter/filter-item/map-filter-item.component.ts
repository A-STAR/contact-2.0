import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
  IMapToolbarFilterItem,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';
import {
  IMapFilterItemAction,
  MapFilters,
  IMapFilterMultiSelectOptions,
} from '@app/shared/components/map/components/controls/filter/map-filter.interface';
import { IMultiSelectOption } from '@app/shared/components/form/select/select.interface';

import { MenuSelectComponent } from '@app/shared/components/menu/menu-select/menu-select.component';
import { TickComponent } from '@app/shared/components/form/check/tick/tick.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-map-filter-item',
  templateUrl: './map-filter-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./map-filter-item.component.scss']
})
export class MapFilterItemComponent implements OnInit {
  @ViewChild(MenuSelectComponent) menuSelectCmp: MenuSelectComponent;
  @ViewChild(TickComponent) tickCmp: TickComponent;

  @Input() config: IMapToolbarFilterItem;
  @Output() action = new EventEmitter<IMapFilterItemAction>();
  ready$ = new BehaviorSubject<IMapFilterMultiSelectOptions>(null);
  filterId: MapFilters = this.config.filter;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  changeValue(value: any): void {
    if (this.menuSelectCmp) {
      value ? this.menuSelectCmp.selectAll() : this.menuSelectCmp.deselectAll();
    }
    if (this.tickCmp) {
      this.tickCmp.writeValue(value);
      this.config.checked = value;
    }

    this.cdRef.markForCheck();
  }

  onMenuSelectReady($event: IMultiSelectOption[]): void {
    if (this.filterId != null) {
      this.ready$.next({ [this.filterId] : $event.map(o => o.value) });
    }
  }

  onAction(value: any): void {
    this.action.emit({ value, item: this.config });
  }

  isDisabled(item: IMapToolbarFilterItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

}
