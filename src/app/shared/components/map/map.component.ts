import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DoCheck,
  OnDestroy
} from '@angular/core';
import { empty } from 'rxjs/observable/empty';

import {
  IMapService,
  IMarker,
  IMapOptions,
  ILatLng,
  IControlDef,
  IMapComponents,
} from '@app/core/map-providers/map-providers.interface';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  host: { class: 'full-size' },
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent<T> implements AfterViewInit, DoCheck, OnDestroy {
  @ViewChild('container') private mapEl: ElementRef;

  @Input() markers: IMarker<T>[];
  @Input() options: IMapOptions = {
    zoom: 6,
    center: {
      lat: 55.724303,
      lng: 37.609522
    },
  };

  @Input() controls: IControlDef<T>[];

  @Input() styles: CSSStyleDeclaration;

  map: any;
  private components: IMapComponents<T> = {};
  private bounds;
  // markers instances
  private _markers: any[] = [];

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
  ) { }

  ngAfterViewInit(): void {
    this.mapService
      .init(
        {
          el: this.mapEl.nativeElement,
          ...this.options,
        }
      )
      .catch( e => {
        this.notificationsService.fetchError(e).dispatch();
        return empty();
      })
      .subscribe((map: any) => {
        if (map) {
          this.map = map;
          this.bounds = this.mapService.createBounds([ this.options.center, this.options.center ]);
          this.addMarkers(this.markers);
          this.addControls(this.controls);
          this.fitBounds();
          this.detectCmpsChanges(this.components);
          this.cdRef.markForCheck();
        }
      });
  }

  ngDoCheck(): void {
    this.detectCmpsChanges(this.components);
  }

  ngOnDestroy(): void {
    if (this.mapService.removeMap) {
      this.mapService.removeMap(this.map, this._markers, this.components.controls);
      this._markers = [];
    }
  }

  detectCmpsChanges(cmps: IMapComponents<T>): void {
    const componentTypes = Object.keys(cmps);
    if (componentTypes && componentTypes.length) {
      componentTypes
        .map(cmpType => cmps[cmpType].map(cmpRef => cmpRef())
          .filter(cmp => cmp && !cmp.changeDetectorRef['destroyed'])
          .forEach(cmp => cmp.changeDetectorRef.detectChanges()));
    }
  }

  addMarkers(markers: IMarker<T>[]): void {
    if (markers && markers.length) {
      this.components.popups = markers
        .map(marker => this.mapService.createMarker<T>(this.map, marker))
        .map(({ popupRef, marker }) => {

          if (this.options.fitToData) {
            this.bounds.extend(this.getLatLng(marker));
          }

          if (marker) {
            this._markers.push(marker);
          }

          return popupRef;
        })
        .filter(Boolean);
    }
  }

  addControls(controls: IControlDef<T>[]): void {
    if (controls && controls.length) {
      this.components.controls = controls.map(cDef => this.mapService.createControl(this.map, cDef));
    }
  }

  private fitBounds(): void {
    if (this.options.fitToData && this.map) {
      this.map.fitBounds(this.bounds);
    }
  }

  private getLatLng(marker: any): ILatLng {
    return typeof marker.getPosition === 'function' ? marker.getPosition() : marker.getLatLng();
  }

}
