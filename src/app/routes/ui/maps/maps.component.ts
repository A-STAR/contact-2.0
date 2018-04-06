import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Type } from '@angular/core';
import { random, name, address } from 'faker';
import { IDebtorAddress } from '@app/routes/ui/maps/maps.interface';
import { IMarker } from '@app/shared/components/map/map.interface';

import { PopupComponent } from '@app/shared/components/map/popups/popup.component';

import { range } from '@app/core/utils';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsComponent implements OnInit {

  markers: IMarker<IDebtorAddress>[];

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.markers = this.generateMarkers();
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
      popup: PopupComponent as Type< { data: IDebtorAddress } >,
      data: {
        name: name.findName(),
        address: address.streetAddress()
      }
    }));
  }

}