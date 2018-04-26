import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';

import { IAddressByPerson } from '@app/shared/mass-ops/address/address.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import {
  IMapOptions,
  IMapService,
  IControlDef,
  MapControlPosition,
  ILayerDef,
  LayerType,
} from '@app/core/map-providers/map-providers.interface';
import {
  MapToolbarFilterItemType,
  MapToolbarItemType,
  IMapToolbarItem,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';
import { MapFilters } from '@app/shared/components/map/components/controls/filter/map-filter.interface';

import { AddressService } from '../address.service';

import { MapToolbarComponent } from '@app/shared/components/map/components/controls/toolbar/map-toolbar.component';
import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-map-address',
  styleUrls: [ './address.component.scss' ],
  templateUrl: './address.component.html',
})
export class AddressComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<void>();

  @ViewChild('tpl') tpl: TemplateRef<IAddressByPerson>;

  dialog: string;
  layers: ILayerDef<IAddressByPerson>[][];
  options: IMapOptions = { fitToData: true, zoom: 8 };
  controls: IControlDef<IMapToolbarItem[]>[] = [
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
              filter: MapFilters.TOGGLE_ALL,
              label: 'massOperations.addressesByContacts.filter.showAllAdresses',
              enabled: of(true),
              checked: true
            },
            {
              type: MapToolbarFilterItemType.SEPARATOR,
            },
            {
              type: MapToolbarFilterItemType.DICTIONARY,
              filter: MapFilters.ADDRESS_TYPE,
              label: 'massOperations.addressesByContacts.filter.filterByAddressType',
              dictCode: 21,
              enabled: of(true),
              preserveOnClick: true,
            },
            {
              type: MapToolbarFilterItemType.DICTIONARY,
              filter: MapFilters.ADDRESS_STATUS,
              label: 'massOperations.addressesByContacts.filter.filterByStatusType',
              dictCode: 22,
              enabled: of(true),
              preserveOnClick: true,
            },
            {
              type: MapToolbarFilterItemType.SEPARATOR,
            },
            {
              type: MapToolbarFilterItemType.CHECKBOX,
              filter: MapFilters.INACTIVE,
              label: 'massOperations.addressesByContacts.filter.showInactives',
              enabled: this.userPermissionsService.has('MAP_INACTIVE_ADDRESS_VIEW'),
              checked: true
            },
            {
              type: MapToolbarFilterItemType.SEPARATOR,
            },
            {
              type: MapToolbarFilterItemType.BUTTON,
              filter: MapFilters.RESET,
              label: 'massOperations.addressesByContacts.filter.resetFilter',
              enabled: of(true),
            },
          ]
        },
      ]
    }
  ];

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    @Inject(MAP_SERVICE) private mapService: IMapService<IAddressByPerson>,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.addressService
      .getAddressesByPersons(this.actionData.payload)
      .pipe(
        map(addresses =>
          addresses.map(address => ({
            latlngs: { lat: address.latitude, lng: address.longitude },
            type: LayerType.MARKER,
            iconConfig: this.mapService.getIconConfig('addressByPerson', address),
            data: address,
            popup: PopupComponent,
            tpl: this.tpl,
          })),
        ),
      )
      .filter(markers => Boolean(markers && markers.length))
      .subscribe(markers => {
        this.options.center = { lat: markers[0].latlngs.lat, lng: markers[0].latlngs.lng };
        this.layers = [ markers ];
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
