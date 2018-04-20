import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { random, name, address } from 'faker';
import { of } from 'rxjs/observable/of';

import { IDebtorAddress } from '@app/routes/ui/maps/maps.interface';
import { IMarker, IControlDef, MapControlPosition } from '@app/core/map-providers/map-providers.interface';
import {
  MapToolbarItemType,
  IMapToolbarItem,
  MapToolbarFilterItemType,
  IMapToolbarActionData,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';
import { MapFilters } from '@app/shared/components/map/components/controls/filter/map-filter.interface';

import { MapToolbarComponent } from '@app/shared/components/map/components/controls/toolbar/map-toolbar.component';
import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

import { range } from '@app/core/utils';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsComponent implements OnInit {

  markers: IMarker<IDebtorAddress>[];
  controls: IControlDef<IMapToolbarItem[]>[];
  @ViewChild('tpl')
  tpl: TemplateRef<IDebtorAddress>;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.markers = this.generateMarkers();
    this.controls = this.getControls();
    this.cdRef.markForCheck();
  }

  onNameChange(value: any, index: number): void {
    this.markers[index].data.name = value;
  }

  onAddressChange(value: any, index: number): void {
    this.markers[index].data.address = value;
  }

  private generateMarkers(count: number = 5): IMarker<IDebtorAddress>[] {
    return range(1, count).map(_ => ({
      lat: 55 + random.number({ min: 0, max: 1, precision: 0.0001 }),
      lng: 37 + random.number({ min: 0, max: 1, precision: 0.0001 }),
      popup: PopupComponent,
      tpl: this.tpl,
      data: {
        name: name.findName(),
        address: address.streetAddress()
      }
    }));
  }

  private getControls(): IControlDef<IMapToolbarItem[]>[] {
    return [
        {
          position: MapControlPosition.BOTTOM_LEFT,
          hostClass: 'map-toolbar-placement',
          cmp: MapToolbarComponent,
          data: [
            {
              type: MapToolbarItemType.FILTER,
              enabled: of(true),
              children: [
                {
                  type: MapToolbarFilterItemType.CHECKBOX,
                  filter: MapFilters.ALL,
                  label: 'Отображать все адреса',
                  enabled: of(true),
                  checked: true
                },
                {
                  type: MapToolbarFilterItemType.SEPARATOR,
                },
                {
                  type: MapToolbarFilterItemType.DICTIONARY,
                  filter: MapFilters.ADDRESS_TYPE,
                  label: 'Фильтр по типу адреса',
                  dictCode: 21,
                  enabled: of(true),
                  preserveOnClick: true,
                },
                {
                  type: MapToolbarFilterItemType.DICTIONARY,
                  filter: MapFilters.ADDRESS_STATUS,
                  label: 'Фильтр по статусу адреса',
                  dictCode: 21,
                  enabled: of(true),
                  preserveOnClick: true,
                },
                {
                  type: MapToolbarFilterItemType.DICTIONARY,
                  filter: MapFilters.VISIT_STATUS,
                  label: 'Фильтр по типу выезда',
                  dictCode: 21,
                  enabled: of(true),
                  preserveOnClick: true,
                },
                {
                  type: MapToolbarFilterItemType.SEPARATOR,
                },
                {
                  type: MapToolbarFilterItemType.CHECKBOX,
                  filter: MapFilters.INACTIVE,
                  label: 'Отображать все заблокированные адреса',
                  // enabled: this.userPermissionsService.has('MAP_INACTIVE_ADDRESS_VIEW'),
                  enabled: of(true),
                  checked: true
                },
                {
                  type: MapToolbarFilterItemType.SEPARATOR,
                },
                {
                  type: MapToolbarFilterItemType.BUTTON,
                  filter: MapFilters.RESET,
                  label: 'Сбросить фильтр',
                  enabled: of(true),
                },
              ]
            },
          ]
        }
    ];
  }

}
