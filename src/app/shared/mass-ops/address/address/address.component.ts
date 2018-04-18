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

import { IAddressByPerson } from '@app/shared/mass-ops/address/address.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IMarker, IMapOptions, IMapService } from '@app/core/map-providers/map-providers.interface';

import { AddressService } from '../address.service';

import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

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
  markers: IMarker<IAddressByPerson>[];
  options: IMapOptions = { fitToData: true, zoom: 8 };

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    @Inject(MAP_SERVICE) private mapService: IMapService,
  ) {}

  ngOnInit(): void {
    this.addressService
      .getAddressesByPersons(this.actionData.payload)
      .pipe(
        map(addresses =>
          addresses.map(address => ({
            lat: address.latitude,
            lng: address.longitude,
            iconConfig: this.mapService.getIconConfig('addressByPerson', address),
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
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
