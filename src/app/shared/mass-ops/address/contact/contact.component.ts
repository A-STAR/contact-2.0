import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';

import {
  IAddressByContact,
} from '@app/shared/mass-ops/address/address.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import {
  IMarker,
  IMapOptions,
  IMapService,
  MapControlPosition,
  IControlDef,
} from '@app/core/map-providers/map-providers.interface';
import {
  MapToolbarFilterItemType,
  MapToolbarItemType,
  IMapToolbarItem,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';

import { AddressService } from '../address.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { MapFilters } from '@app/shared/components/map/components/controls/filter/map-filter.interface';
import { MapToolbarComponent } from '@app/shared/components/map/components/controls/toolbar/map-toolbar.component';
import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

@Component({
  selector: 'app-map-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<void>();

  @ViewChild('tpl') tpl: TemplateRef<IAddressByContact>;

  dialog: string;
  markers: IMarker<IAddressByContact>[];
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
              filter: MapFilters.ALL,
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
              dictCode: 21,
              enabled: of(true),
              preserveOnClick: true,
            },
            {
              type: MapToolbarFilterItemType.DICTIONARY,
              filter: MapFilters.CONTACT_TYPE,
              label: 'massOperations.addressesByContacts.filter.filterByContactType',
              dictCode: 50,
              enabled: of(true),
              preserveOnClick: true,
            },
            {
              type: MapToolbarFilterItemType.DICTIONARY,
              filter: MapFilters.VISIT_STATUS,
              label: 'massOperations.addressesByContacts.filter.filterByVisitType',
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
              label: 'massOperations.addressesByContacts.filter.showInactives',
              enabled: this.userPermissionsService.has('MAP_INACTIVE_ADDRESS_VIEW'),
              checked: true
            },
            {
              type: MapToolbarFilterItemType.CHECKBOX,
              filter: MapFilters.HIDE_ADDRESSES,
              label: 'massOperations.addressesByContacts.filter.hideAddresses',
              checked: false
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
    @Inject(MAP_SERVICE) private mapService: IMapService<IAddressByContact>,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.addressService
      .getAddressesByContacts(this.actionData.payload)
      .pipe(
        map(response =>
          response.reduce((acc: IMarker<IAddressByContact>[], address) => {
            const addressMarker = [{
              lat: address.contactLatitude,
              lng: address.contactLongitude,
              iconConfig: this.mapService.getIconConfig('addressByContact', {
                ...address,
                typeCode: (address as IAddressByContact).contactType,
                isInactive: false
              }),
              data: address,
              popup: PopupComponent,
              tpl: this.tpl,
            }];
            if (address.addressLatitude && address.addressLongitude) {
              addressMarker.push(
                {
                  lat: address.addressLatitude,
                  lng: address.addressLongitude,
                  iconConfig: this.mapService.getIconConfig('addressByContact', {
                    ...address,
                    typeCode: (address as IAddressByContact).addressTypeCode,
                    isInactive: false
                  }),
                  data: address,
                  popup: PopupComponent,
                  tpl: this.tpl,
                }
              );
            }
            acc.push(...addressMarker);
            return acc;
          }, []),
        ),
      )
      .filter(markers => Boolean(markers && markers.length))
      .subscribe(markers => {
        this.options.center = { lat: markers[0].lat, lng: markers[0].lng };
        this.markers = markers;
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
