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
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter } from 'rxjs/operators/filter';
import { first } from 'rxjs/operators/first';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

import { IMapService } from '@app/core/map-providers/map-providers.interface';
import {
  IMapToolbarFilterItem,
  IMapToolbarActionData,
  MapToolbarItemType,
  IMapToolbarItem,
} from '../toolbar/map-toolbar.interface';

import {
  MapFilters,
  IMapFilterItemAction,
  IMapFilterMultiSelectOptions,
} from './map-filter.interface';

import { MapFilterService } from '@app/shared/components/map/components/controls/filter/map-filter.service';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';
import { MapFilterItemComponent } from './filter-item/map-filter-item.component';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
  providers: [
    MapFilterService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFilterComponent<T> implements AfterViewInit {
  @Input() set config(data: IMapToolbarItem) {
    this._config = data;
    this._originalConfig = {...data, children: data.children.map(c => ({ ...c })) };
  }

  @Output() action = new EventEmitter<IMapToolbarActionData>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;
  @ViewChildren(MapFilterItemComponent) items: QueryList<MapFilterItemComponent>;

  container: HTMLElement;
  private map: any;
  private _originalConfig: IMapToolbarItem;
  private _config: IMapToolbarItem;
  private nonTogglableFilters = [
    MapFilters.TOGGLE_ALL,
    MapFilters.TOGGLE_ACCURACY,
    MapFilters.TOGGLE_ADDRESSES,
  ];
  private togglableFilters = [
    MapFilters.TOGGLE_INACTIVE,
    MapFilters.ADDRESS_STATUS,
    MapFilters.ADDRESS_TYPE,
    MapFilters.CONTACT_TYPE,
    MapFilters.VISIT_STATUS,
  ];

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>,
    private cdRef: ChangeDetectorRef,
    private mapFilterService: MapFilterService<T>,
  ) { }

  get config(): IMapToolbarItem {
    return this._config;
  }

  ngAfterViewInit(): void {
    this.container = this.mapService.container;
    this.map = this.mapService.getMap();

    const menuSelects$ = this.items
      .filter(item => Boolean(item.menuSelectCmp || item.tickCmp))
      .map(_item => _item.ready$);

    combineLatest(...menuSelects$).pipe(
        filter(values => values.every(Boolean)),
        first(),
      )
      .subscribe((filters: IMapFilterMultiSelectOptions[] ) => {
        const normalizedFilters = filters.reduce((acc, f) => ({ ...acc, ...f }) , {});
        this.setInitialFilters(normalizedFilters);
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

    if (action.item.filter === MapFilters.TOGGLE_ALL) {

      this.items
        .filter(item => Boolean(!this.nonTogglableFilters.includes(item.config.filter) && (item.menuSelectCmp || item.tickCmp)))
        .forEach(item => item.changeValue(action.value));

    } else if (action.item.filter === MapFilters.RESET) {

      this.onReset(MapFilters.TOGGLE_ALL, true);
      this.onReset(MapFilters.TOGGLE_ADDRESSES);
      this.onReset(MapFilters.TOGGLE_ACCURACY);

    } else if (this.togglableFilters.includes(action.item.filter)) {

      const cmps = this.items.filter(item => this.togglableFilters.includes(item.config.filter) &&
        Boolean(item.tickCmp || item.menuSelectCmp));

      const allSelected = cmps.every(i => (i.menuSelectCmp && i.menuSelectCmp.allSelected) || (i.tickCmp && i.tickCmp.value));

      this.changeFilterValue(MapFilters.TOGGLE_ALL, allSelected);
    }

    this.cdRef.markForCheck();
  }

  private onReset(filterType: MapFilters, doAction: boolean = false): void {
    const config = this.getFilterConfig(filterType, this._originalConfig);
    if (config) {
      if (doAction) {
        this.handleAction({ item: config, value: config.checked });
      }
      this.changeFilterValue(filterType, config.checked);
    }
  }

  private changeFilterValue(filterType: MapFilters, value: any): void {
    const cmp = this.getFilterCmp(filterType);
    if (cmp) {
      cmp.changeValue(value);
    }
  }

  private setInitialFilters(filters: IMapFilterMultiSelectOptions): void {
    const config = this.getFilterConfig(MapFilters.TOGGLE_ALL, this._config);
    const checked =  (config && config.checked) || null;
    if (config) {
      this.handleAction({ item: config, value: config.checked });
    }
    this.mapFilterService.setActiveFilters(filters, checked);
    this.cdRef.markForCheck();
  }

  private getFilterConfig(filterType: MapFilters, config: IMapToolbarItem): IMapToolbarFilterItem {
    return config.children.find((c: IMapToolbarFilterItem) => c.filter === filterType);
  }

  private getFilterCmp(filterType: MapFilters): MapFilterItemComponent {
    return this.items.find(c => c.config.filter === filterType);
  }

}
