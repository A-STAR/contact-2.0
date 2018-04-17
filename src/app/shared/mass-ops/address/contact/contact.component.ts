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
} from '@angular/core';
import { map } from 'rxjs/operators/map';

import {
  IAddressByContact,
} from '@app/shared/mass-ops/address/address.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IMarker, IMapOptions, IMapService } from '@app/core/map-providers/map-providers.interface';

import { AddressService } from '../address.service';

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

  constructor(
    private addressService: AddressService,
    @Inject(MAP_SERVICE) private mapService: IMapService,
  ) {}

  ngOnInit(): void {
    this.addressService
      .getAddressesByContacts(this.actionData.payload)
      .pipe(
        map(response =>
          response.map(address => ({
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
          })),
        ),
      )
      .filter(markers => Boolean(markers && markers.length))
      .subscribe(markers => {
        this.options.center = { lat: markers[0].lat, lng: markers[0].lng };
        this.markers = markers;
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
