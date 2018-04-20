import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  host: { class: 'full-size' },
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent<T> implements AfterViewInit, OnDestroy {
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

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>,
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
      .pipe(
        tap((map: any) => {
          if (map) {
            this.map = map;
            this.bounds = this.mapService.createBounds([ this.options.center, this.options.center ]);
            this.addMarkers(this.markers);
            this.addControls(this.controls);
            this.cdRef.markForCheck();
          }
        }),
        // NOTE: the only way I found to fit bounds properly, is when map already has size (i.lobanov)
        delay(200)
      )
      .subscribe(_ => this.fitBounds());

  }

  ngOnDestroy(): void {
    this.removeComponents(this.components);
    this.mapService.removeMap();
    this.components = {};
  }

  addMarkers(markers: IMarker<T>[]): void {
    if (markers && markers.length) {
      this.components.popups = markers
        .map(marker => this.mapService.createMarker(marker))
        .map(({ popupRef, entity }) => {

          if (this.options.fitToData) {
            this.bounds.extend(this.getLatLng(entity.marker));
          }

          return popupRef;
        })
        .filter(Boolean);
    }
  }

  addControls(controls: IControlDef<T>[]): void {
    if (controls && controls.length) {
      this.components.controls = controls.map(cDef => this.mapService.createControl(cDef));
    }
  }

  removeComponents(cmps: IMapComponents<T>): void {
    const componentTypes = Object.keys(cmps);
    if (componentTypes && componentTypes.length) {
      componentTypes
        .map(cmpType => cmps[cmpType].map(cmpRef => cmpRef())
          .filter(cmp => cmp && !cmp.changeDetectorRef['destroyed'])
          .forEach(cmp => cmp.changeDetectorRef.destroy()));
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
