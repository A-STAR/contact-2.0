import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Type, ViewChild, TemplateRef } from '@angular/core';
import { random, name, address } from 'faker';

import { IDebtorAddress } from '@app/routes/ui/maps/maps.interface';
import { IMarker, IControlDef, IControlCmp, MapControlPosition } from '@app/core/map-providers/map-providers.interface';

import { PopupComponent } from '@app/shared/components/map/components/popups/popup.component';

import { range } from '@app/core/utils';
import { of } from 'rxjs/observable/of';
import { MapToolbarComponent } from '@app/shared/components/map/components/controls/toolbar/map-toolbar.component';
import {
  MapToolbarItemType,
  IMapToolbarItem,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsComponent implements OnInit {

  markers: IMarker<IDebtorAddress>[];
  controls: IControlDef<IMapToolbarItem[]>[];
  @ViewChild('tpl')
  tpl: TemplateRef<IDebtorAddress>;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.markers = this.generateMarkers();
    this.controls = this.getControls();
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
      popup: PopupComponent as Type< { context: { data: IDebtorAddress } } >,
      tpl: this.tpl,
      data: {
        name: name.findName(),
        address: address.streetAddress()
      }
    }));
  }

  private getControls(): IControlDef<IMapToolbarItem[]>[] {
    return [
        {
          position: MapControlPosition.BOTTOM_LEFT,
          hostClass: 'map-toolbar-placement',
          cmp: MapToolbarComponent as Type<IControlCmp<IMapToolbarItem[]>>,
          data: [
            {
              type: MapToolbarItemType.BUTTON,
              action: (map: any) => map && alert('button'),
              enabled: of(true),
            },
            {
              type: MapToolbarItemType.FILTER,
              enabled: of(true),
              children: []
            }
          ]
        }
    ];
  }

}
