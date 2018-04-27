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
  IMapOptions,
  IMapService,
  MapControlPosition,
  IControlDef,
  ILayerDef,
  LayerType,
} from '@app/core/map-providers/map-providers.interface';
import {
  MapToolbarFilterItemType,
  MapToolbarItemType,
  IMapToolbarItem,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';

import { AddressService } from '../address.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';

import { MapFilters } from '@app/shared/components/map/components/controls/filter/map-filter.interface';
import { MapToolbarComponent } from '@app/shared/components/map/components/controls/toolbar/map-toolbar.component';
import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';
import { combineLatest } from 'rxjs/observable/combineLatest';

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
  layers: ILayerDef<IAddressByContact>[][];
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
              filter: MapFilters.CONTACT_TYPE,
              label: 'massOperations.addressesByContacts.filter.filterByContactType',
              dictCode: 50,
              enabled: of(true),
              preserveOnClick: true,
            },
            {
              type: MapToolbarFilterItemType.SEPARATOR,
            },
            {
              type: MapToolbarFilterItemType.CHECKBOX,
              filter: MapFilters.TOGGLE_ADDRESSES,
              label: 'massOperations.addressesByContacts.filter.hideAddresses',
              checked: false
            },
            {
              type: MapToolbarFilterItemType.CHECKBOX,
              filter: MapFilters.TOGGLE_ACCURACY,
              label: 'massOperations.addressesByContacts.filter.hideAccuracy',
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
    private userConstantsService: UserConstantsService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userConstantsService.get('VisitContactAddress.AllowableDeviationRadius'),
      this.addressService.getAddressesByContacts(this.actionData.payload)
      )
      .pipe(
        map(([constant, response]) => {
          return response.reduce((acc: ILayerDef<IAddressByContact>[][], address) => {
            acc.push(this.createContactGroup(address, constant));
            return acc;
          }, []);
        }),
      )
      .subscribe(layers => {
        this.layers = layers;
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }

  private createContactGroup(data: IAddressByContact, constant: IUserConstant): ILayerDef<IAddressByContact>[] {
    const group = [
        {
        latlngs: { lat: data.contactLatitude, lng: data.contactLongitude },
        type: LayerType.MARKER,
        iconConfig: this.mapService.getIconConfig('addressByContact', {
          ...data,
          typeCode: (data as IAddressByContact).contactType,
          isInactive: false
        }),
        data,
        popup: PopupComponent,
        tpl: this.tpl,
      },
      {
        latlngs: { lat: data.contactLatitude, lng: data.contactLongitude },
        radius: data.accuracy || constant.valueN,
        type: LayerType.CIRCLE,
        iconConfig: this.mapService.getIconConfig('addressByContact', {
          ...data,
          typeCode: (data as IAddressByContact).contactType,
          isInactive: false
        }),
      }
    ];
    if (data.addressLatitude && data.addressLongitude) {
      group.push(
        {
          latlngs: { lat: data.addressLatitude, lng: data.addressLongitude },
          type: LayerType.MARKER,
          iconConfig: this.mapService.getIconConfig('addressByContact', {
            ...data,
            typeCode: (data as IAddressByContact).addressTypeCode,
            isInactive: false
          }),
          data,
          popup: PopupComponent,
          tpl: this.tpl,
        },
        {
          latlngs: [
            { lat: data.contactLatitude, lng: data.contactLongitude },
            { lat: data.addressLatitude, lng: data.addressLongitude },
          ],
          type: LayerType.POLYLINE,
          data
        } as any
      );
    }
    return group;
  }
}
