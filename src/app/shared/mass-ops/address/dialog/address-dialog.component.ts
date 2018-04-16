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
  IAddressByPerson,
  IAddressByContact,
} from '@app/shared/mass-ops/address/address.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IMarker, IMapService, IMapOptions } from '@app/shared/components/map/map.interface';
import { MAP_SERVICE } from '@app/shared/components/map/map.component';

import { AddressService } from '../address.service';

import { PopupComponent } from '@app/shared/components/map/popups/popup.component';
import { tap } from 'rxjs/operators/tap';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./address-dialog.component.scss'],
})
export class AddressDialogComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<void>();

  @ViewChild('tpl') tpl: TemplateRef<IAddressByPerson | IAddressByContact>;

  dialog: string;
  markers: IMarker<IAddressByPerson | IAddressByContact>[];
  options: IMapOptions = { fitToData: true, zoom: 8 };

  entityType = { entityType: 'persons' };

  constructor(
    private addressService: AddressService,
    @Inject(MAP_SERVICE) private mapService: IMapService,
  ) {}

  ngOnInit(): void {
    this.addressService
      .getAddresses(this.actionData)
      .pipe(
        tap(response => { this.entityType.entityType = response.entityType; }),
        map(response =>
          response.data.map(address => ({
            lat: address.latitude,
            lng: address.longitude,
            iconConfig: this.mapService.getIconConfig(
              this.toIconConfigParam(response.entityType, address)
            ),
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

  private toIconConfigParam(entityType: string, address: IAddressByContact | IAddressByPerson): any {
    return entityType === 'contact' ? {
      ...address,
      typeCode: (address as IAddressByContact).contactType,
      isInactive: false,
    } : address as IAddressByPerson;
  }
}
