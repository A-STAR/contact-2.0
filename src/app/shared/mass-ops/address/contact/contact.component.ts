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

  controls: IControlDef<IMapToolbarItem[]>[] = [];

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    @Inject(MAP_SERVICE) private mapService: IMapService<IAddressByContact>,
    private userConstantsService: UserConstantsService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userConstantsService.bag(),
      this.addressService.getAddressesByContacts(this.actionData.payload)
      )
      .pipe(
        map(([constants, response]) => {
          const constant = constants.get('VisitContactAddress.AllowableDeviationRadius');
          this.controls = this.getControls(constant);
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
    const iconConfig = this.mapService.getIconConfig('addressByContact', {
      ...data,
      typeCode: (data as IAddressByContact).contactType,
      isInactive: false
    }, constant);
    const group = [
        {
        latlngs: { lat: data.contactLatitude, lng: data.contactLongitude },
        type: LayerType.MARKER,
        iconConfig,
        data: {...data, isContact: true},
        popup: PopupComponent,
        tpl: this.tpl,
      },
      {
        latlngs: { lat: data.contactLatitude, lng: data.contactLongitude },
        radius: data.accuracy || 10,
        type: LayerType.CIRCLE,
        options: {
          fillColor: '#' + iconConfig.fillColor,
          fillOpacity: 0.4,
          strokeColor: '#' + iconConfig.fillColor
        },
      }
    ];
    if (data.addressLatitude && data.addressLongitude) {
      group.push(
        {
          latlngs: { lat: data.addressLatitude, lng: data.addressLongitude },
          type: LayerType.MARKER,
          iconConfig: this.mapService.getIconConfig('addressByPerson', {
            ...data,
            typeCode: (data as IAddressByContact).addressTypeCode,
            isInactive: false
          }),
          data,
          popup: PopupComponent,
          tpl: this.tpl,
        } as any,
        {
          latlngs: [
            { lat: data.contactLatitude, lng: data.contactLongitude },
            { lat: data.addressLatitude, lng: data.addressLongitude },
          ],
          type: LayerType.POLYLINE,
          options: {
            strokeColor: '#' + this.mapService.getIconConfig('addressByContactLine').fillColor
          },
          data
        } as any
      );
    }
    return group;
  }

  private getControls(constant: IUserConstant): IControlDef<IMapToolbarItem[]>[] {
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
                type: MapToolbarItemType.CHECKBOX,
                filter: MapFilters.TOGGLE_ALL,
                label: 'massOperations.addressesByContacts.filter.showAllAdresses',
                enabled: of(true),
                checked: true
              },
              {
                type: MapToolbarItemType.SEPARATOR,
              },
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
                filter: MapFilters.CONTACT_TYPE,
                label: 'massOperations.addressesByContacts.filter.filterByContactType',
                dictCode: 50,
                enabled: of(true),
                preserveOnClick: true,
              },
              {
                type: MapToolbarItemType.SEPARATOR,
              },
              {
                type: MapToolbarItemType.CHECKBOX,
                filter: MapFilters.TOGGLE_ADDRESSES,
                label: 'massOperations.addressesByContacts.filter.hideAddresses',
                checked: false
              },
              {
                type: MapToolbarItemType.CHECKBOX,
                filter: MapFilters.TOGGLE_ACCURACY,
                label: 'massOperations.addressesByContacts.filter.hideAccuracy',
                checked: false
              },
              {
                type: MapToolbarItemType.SEPARATOR,
              },
              {
                type: MapToolbarItemType.SLIDER,
                filter: MapFilters.DISTANCE,
                showInput: true,
                value: constant,
                label: 'massOperations.addressesByContacts.filter.distance',
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
