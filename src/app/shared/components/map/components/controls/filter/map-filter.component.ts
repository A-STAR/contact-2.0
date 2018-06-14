import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { filter } from 'rxjs/operators/filter';
import { first } from 'rxjs/operators/first';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { zip } from 'rxjs/observable/zip';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

import { IMapService } from '@app/core/map-providers/map-providers.interface';
import {
  IMapToolbarFilterItem,
  IMapToolbarActionData,
  MapToolbarItemType,
  IMapToolbarItem,
} from '../toolbar/map-toolbar.interface';
import { MapFilters, IMapFilterItemAction } from '@app/shared/components/map/components/controls/filter/map-filter.interface';

import { MapFilterService } from '@app/shared/components/map/components/controls/filter/map-filter.service';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';
import { MapFilterItemComponent } from './filter-item/map-filter-item.component';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFilterComponent<T> implements AfterViewInit {
  @Input() config: IMapToolbarItem;
  @Output() action = new EventEmitter<IMapToolbarActionData>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;
  @ViewChildren(MapFilterItemComponent) items: QueryList<MapFilterItemComponent>;

  container: HTMLElement;
  private map: any;

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>,
    private cdRef: ChangeDetectorRef,
    private mapFilterService: MapFilterService<T>,
  ) { }

  ngAfterViewInit(): void {
    this.container = this.mapService.container;
    this.map = this.mapService.getMap();

    const menuSelects$ = this.items.filter(item => Boolean(item.menuSelect)).map(_item => _item.ready$);

    zip(...menuSelects$).pipe(
      filter(values => values.every(Boolean)),
      first(),
    )
      .subscribe(() => {
        const toggleAllConfig = this.config.children.find((c: IMapToolbarFilterItem) => c.filter === MapFilters.TOGGLE_ALL);
        if (toggleAllConfig) {
          this.handleAction({ item: toggleAllConfig, value: (toggleAllConfig as IMapToolbarFilterItem).checked });
          this.cdRef.markForCheck();
        }
      });


  }

  onAction(action: IMapFilterItemAction): void {
    if (this.shouldCloseDropdown(action.item)) {
      this.dropdown.close();
    }

    this.handleAction(action);

    if (action.item.filter) {
      this.mapFilterService.applyFilter(action.item, action.value);
    }

    if (action.item.action) {
      this.action.emit({ item: action.item, value: action.value, map: this.map });
    }
  }

  isDisabled(item: IMapToolbarFilterItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  private shouldCloseDropdown(item: IMapToolbarFilterItem): boolean {
    return !(item.preserveOnClick || [
      MapToolbarItemType.CHECKBOX,
      MapToolbarItemType.SLIDER
    ].includes(item.type));
  }

  private handleAction(action: IMapFilterItemAction): void {

    if ((action.item.filter as MapFilters) === MapFilters.TOGGLE_ALL) {

      this.items
        .filter(item => Boolean(item.config.filter !== MapFilters.TOGGLE_ALL && (item.menuSelect || item.tickCmp)))
        .forEach(item => item.changeValue(action.value));

    } else if ([
      MapToolbarItemType.DICTIONARY,
      MapToolbarItemType.LOOKUP
    ].includes(action.item.type)) {
      const menuSelectCtrls = this.items.filter(item => !!item.menuSelect);
      const allSelected = menuSelectCtrls.every(i => i.menuSelect.allSelected);
      const toggleAllCtrl = this.items
        .find(c => c.config.filter === MapFilters.TOGGLE_ALL);

      if (toggleAllCtrl) {
        toggleAllCtrl.changeValue(allSelected);
      }

    }
    this.cdRef.markForCheck();
  }

}
