import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

import { IMapService } from '@app/core/map-providers/map-providers.interface';
import {
  IMapToolbarFilter,
  IMapToolbarFilterItem,
  MapToolbarFilterItemType,
  IMapToolbarActionData,
  IMapToolbarItem,
} from '../toolbar/map-toolbar.interface';
import { MapFilterService } from '@app/shared/components/map/components/controls/filter/map-filter.service';
import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFilterComponent<T> implements OnInit {
  @Input() config: IMapToolbarFilter;
  @Output() action = new EventEmitter<IMapToolbarActionData>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  container: HTMLElement;
  private map: any;

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>,
    private mapFilterService: MapFilterService<T>,
  ) { }

  ngOnInit(): void {
    this.container = this.mapService.container;
    this.map = this.mapService.getMap();
  }

  isDisabled(item: IMapToolbarFilterItem | IMapToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  onChildSelect($event: any, child: IMapToolbarFilterItem): void {
    if (this.shouldCloseDropdown(child)) {
      this.dropdown.close();
    }
    if (child.filter) {
      this.mapFilterService.applyFilter(child, $event);
    }
    if (child.action) {
      this.action.emit({ item: child, value: $event, map: this.map });
    }
  }

  private shouldCloseDropdown(child: IMapToolbarFilterItem): boolean {
    return !(child.preserveOnClick || [
      MapToolbarFilterItemType.CHECKBOX,
      MapToolbarFilterItemType.SLIDER
    ].includes(child.type));
  }

}
