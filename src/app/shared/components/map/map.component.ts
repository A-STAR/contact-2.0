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
  IMapOptions,
  IControlDef,
  LayerType,
  ILayerDef,
  GeoPoint,
} from '@app/core/map-providers/map-providers.interface';
import { LayersService } from '@app/core/map-providers/map-layers.service';
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

  @Input() layers: ILayerDef<T>[][];
  @Input() options: IMapOptions = {
    zoom: 6,
    center: {
      lat: 55.724303,
      lng: 37.609522
    },
  };

  @Input() controls: IControlDef<T>[];

  @Input() styles: CSSStyleDeclaration;

  static MAX_MAP_ZOOM: 8;
  map: any;
  private bounds;

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>,
    private cdRef: ChangeDetectorRef,
    private layersService: LayersService<T>,
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
            this.addLayers(this.layers);
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
    this.layersService.clear();
    this.mapService.removeMap();
  }

  addLayers(layers: ILayerDef<T>[][]): void {
    if (layers && layers.length) {
      layers
        // for each layer group
        .map(g => this.layersService.createGroup(g))
        .map(group => {
          // extend bounds by geo points layers
          if (this.options.fitToData) {
            group.getLayersByType(LayerType.MARKER).forEach(l => {
              this.bounds.extend(this.getLatLng(l.layer));
            });
          }

        });
    }
  }

  addControls(controls: IControlDef<T>[]): void {
    if (controls && controls.length) {
      controls.forEach(cDef => this.mapService.createControl(cDef));
    }
  }

  private fitBounds(): void {
    if (this.options.fitToData && this.map) {
      this.map.fitBounds(this.bounds);
      if (this.map.getZoom() > MapComponent.MAX_MAP_ZOOM) {
        this.map.setZoom(MapComponent.MAX_MAP_ZOOM);
      }
    }
  }

  private getLatLng(marker: any): GeoPoint {
    return typeof marker.getPosition === 'function' ? marker.getPosition() : marker.getLatLng();
  }

}
