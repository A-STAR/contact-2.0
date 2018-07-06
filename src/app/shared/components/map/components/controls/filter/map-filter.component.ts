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
        this.onReset();
      });
  }

  onAction(action: IMapFilterItemAction): void {
    if (this.shouldCloseDropdown(action.item)) {
      this.dropdown.close();
    }

    if (action.item.filter) {
      this.mapFilterService.applyFilter(action.item, action.value);
      if (action.item.filter === MapFilters.RESET) {
        this.onReset();
      }
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

  private onReset(): void {
    this.items
      .filter(item => Boolean(item.menuSelectCmp || item.tickCmp))
      .forEach(item => item.changeValue(true));
    this.cdRef.markForCheck();
  }

  private setInitialFilters(filters: IMapFilterMultiSelectOptions): void {
    this.mapFilterService.setActiveFilters(filters);
    this.cdRef.markForCheck();
  }

}
