import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import {
  IMapOptions,
  IMapService,
  ILayerDef,
  LayerType,
} from '@app/core/map-providers/map-providers.interface';

import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

@Component({
  selector: 'app-address-grid-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridMapComponent implements OnInit {
  @Input() address: IAddress;
  @Output() cancel = new EventEmitter<void>();
  @ViewChild('addressPopup') tpl: TemplateRef<IAddress>;

  options: IMapOptions;
  layers: ILayerDef<IAddress>[][];

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<IAddress>,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.options = {
      center: {
        lat: this.address.latitude,
        lng: this.address.longitude
      },
      zoom: 13
    };

    this.layers = [
      [
        {
          latlngs: { lat: this.address.latitude, lng: this.address.longitude },
          type: LayerType.MARKER,
          iconConfig: this.mapService.getIconConfig('singleAddress', this.address),
          data: this.address,
          popup: PopupComponent,
          tpl: this.tpl
        }
      ]
    ];

    this.cdRef.markForCheck();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
