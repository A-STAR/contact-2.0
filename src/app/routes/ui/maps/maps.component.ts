import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { of } from 'rxjs/observable/of';

import { IDebtorAddress } from '@app/routes/ui/maps/maps.interface';
import { IControlDef, MapControlPosition, ILayerDef, LayerType } from '@app/core/map-providers/map-providers.interface';
import {
  MapToolbarItemType,
  IMapToolbarItem
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';
import { MapFilters } from '@app/shared/components/map/components/controls/filter/map-filter.interface';

import { MapToolbarComponent } from '@app/shared/components/map/components/controls/toolbar/map-toolbar.component';
import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

import { range, random as randomInt } from '@app/core/utils';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsComponent implements OnInit {

  layers: ILayerDef<IDebtorAddress>[][];
  controls: IControlDef<IMapToolbarItem[]>[];
  @ViewChild('tpl')
  tpl: TemplateRef<IDebtorAddress>;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.layers = [ this.generateMarkers() ];
    this.controls = this.getControls();
    this.cdRef.markForCheck();
  }

  onNameChange(value: any, index: number): void {
    this.layers[0][index].data.name = value;
  }

  onAddressChange(value: any, index: number): void {
    this.layers[0][index].data.address = value;
  }

  private generateMarkers(count: number = 5): ILayerDef<IDebtorAddress>[] {
    return range(1, count).map(i => ({
      latlngs: {
        lat: 55 + Math.random(),
        lng: 37 + Math.random()
      },
      type: LayerType.MARKER,
      popup: PopupComponent,
      tpl: this.tpl,
      data: {
        name: 'Name' + i,
        address: 'Address' + i,
        statusType: randomInt(1, 3),
        typeCode: randomInt(1, 3),
        visitType: randomInt(1, 3),
        isInactive: randomInt(0, 1)
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
                  type: MapToolbarItemType.DICTIONARY,
                  filter: MapFilters.ADDRESS_TYPE,
                  label: 'massOperations.addressesByContacts.filter.filterByAddressType',
                  dictCode: 21,
                  enabled: of(true),
                  preserveOnClick: true,
                },
                {
                  type: MapToolbarItemType.DICTIONARY,
                  filter: MapFilters.ADDRESS_STATUS,
                  label: 'massOperations.addressesByContacts.filter.filterByStatusType',
                  dictCode: 21,
                  enabled: of(true),
                  preserveOnClick: true,
                },
                {
                  type: MapToolbarItemType.DICTIONARY,
                  filter: MapFilters.CONTACT_TYPE,
                  label: 'massOperations.addressesByContacts.filter.filterByContactType',
                  dictCode: 50,
                  enabled: of(true),
                  preserveOnClick: true,
                },
                {
                  type: MapToolbarItemType.DICTIONARY,
                  filter: MapFilters.VISIT_STATUS,
                  label: 'massOperations.addressesByContacts.filter.filterByVisitType',
                  dictCode: 21,
                  enabled: of(true),
                  preserveOnClick: true,
                },
                {
                  type: MapToolbarItemType.SEPARATOR,
                },
                {
                  type: MapToolbarItemType.CHECKBOX,
                  filter: MapFilters.TOGGLE_INACTIVE,
                  label: 'massOperations.addressesByContacts.filter.showInactives',
                  // enabled: this.userPermissionsService.has('MAP_INACTIVE_ADDRESS_VIEW'),
                  enabled: of(true),
                },
                {
                  type: MapToolbarItemType.SEPARATOR,
                },
                {
                  type: MapToolbarItemType.BUTTON,
                  filter: MapFilters.RESET,
                  label: 'massOperations.addressesByContacts.filter.resetFilter',
                  enabled: of(true),
                },
              ]
            },
          ]
        }
    ];
  }

}
