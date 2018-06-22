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

import { LayersService, LayerGroup, Layer } from '@app/core/map-providers/layers/map-layers.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  host: { class: 'full-size' },
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent<T> implements AfterViewInit, OnDestroy {
  @ViewChild('container') private mapEl: ElementRef;

  @Input() options: IMapOptions = {
    zoom: 6,
    center: {
      lat: 55.724303,
      lng: 37.609522
    },
  };

  @Input() set controls(config: IControlDef<T>[])  {
    if (config && config.length) {
      if (this.map) {
        this.addControls(config);
      } else {
        this._controls = config;
      }
    }
  }

  @Input() set layers(config: ILayerDef<T>[][])  {
    if (config && config.length) {
      if (this.map) {
        this.addLayers(config);
      } else {
        this._layers = config;
      }
    }
  }

  @Input() styles: CSSStyleDeclaration;

  static MAX_MAP_ZOOM = 8;
  map: any;
  private bounds;
  private _controls: IControlDef<T>[];
  private _layers: ILayerDef<T>[][];

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
      .subscribe((map: any) => {
        if (map) {
          this.map = map;
          this.bounds = this.mapService.createBounds([ this.options.center, this.options.center ]);
          if (this._controls) {
            this.addControls(this._controls);
            this._controls = null;
          }
          if (this._layers) {
            this.addLayers(this._layers);
            this._layers = null;
          }
          this.cdRef.markForCheck();
        }
      });

  }

  ngOnDestroy(): void {
    this._layers = null;
    this._controls = null;
    this.layersService.clear();
    this.mapService.removeMap();
  }

  addLayers(layers: Array<ILayerDef<T>[] | ILayerDef<T>>): void {
    if (layers && layers.length) {
      layers
        .map(l => Array.isArray(l) ? this.layersService.createGroup(l) : this.layersService.createLayer(l))
        .map(l => {
          // extend bounds by geo points layers
          if (this.options.fitToData) {
            if (l.isGroup) {
              (l as LayerGroup<T>).getLayersByType(LayerType.MARKER).forEach(_l => {
                this.bounds.extend(this.getLatLng(_l.nativeLayer));
              });
            } else {
              this.bounds.extend(this.getLatLng((l as Layer<T>).nativeLayer));
            }
          }

        });
      this.fitBounds();
    }
  }

  addControls(controls: IControlDef<T>[]): void {
    if (controls && controls.length) {
      controls.forEach(cDef => this.mapService.createControl(cDef));
    }
  }

  private fitBounds(): void {
    if (this.options.fitToData && this.map) {
      if (this.bounds) {
        this.map.fitBounds(this.bounds);
      }
      if (this.map.getZoom() > MapComponent.MAX_MAP_ZOOM) {
        this.map.setZoom(MapComponent.MAX_MAP_ZOOM);
      }
    }
  }

  private getLatLng(marker: any): GeoPoint {
    return typeof marker.getPosition === 'function' ? marker.getPosition() : marker.getLatLng();
  }

}
