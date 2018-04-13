import { Injectable, ComponentRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { } from '@types/googlemaps';

import { IMapOptions, IMarker, ICreateMarkerResult, PopupComponentRefGetter, IMarkerIconConfig } from '../../map.interface';
import { Libraries } from './maps-google.interface';

import { ConfigService } from '@app/core/config/config.service';
import { PopupService } from '../../popups/popup.service';


@Injectable()
export class MapGoogleService {
  readonly apiKey = this.configService.config.maps.providers.google.apiKey;
  constructor(
    private configService: ConfigService,
    private popupService: PopupService,
    private zone: NgZone,
  ) {}

  init(mapConfig: IMapOptions): Observable<any> {
    return Observable.create((observer) =>
      this.load(
        _ => {
          observer.next(this.initMap(mapConfig));
          observer.complete();
        },
        e => {
          observer.error(`Couldn't load google-maps library:\n ${e}`);
          observer.complete();
        }
      )
    );
  }

  createMarker<T>(map: google.maps.Map, markerDef: IMarker<T>): ICreateMarkerResult<T> {
    let popupRef;
    const marker = new google.maps.Marker({
      position: { lat: markerDef.lat, lng: markerDef.lng },
      map,
      icon: markerDef.iconConfig ? this.createMarkerIcon(markerDef.iconConfig) : undefined
    });
    if (markerDef.popup) {
      popupRef = this.createPopup<T>(map, marker, markerDef);
    }
    return { marker, popupRef };
  }

  createMarkerIcon(config: IMarkerIconConfig): string {
    const chartsUrl = 'https://chart.googleapis.com/chart?';
    return `${chartsUrl}chs=d_map_pin_letter_withshadow&chld=${config.char}|${config.fillColor}|${config.textColor}`;
  }

  getIconConfig<T extends { typeCode: number, isInactive: number | boolean }>(entity: T): IMarkerIconConfig {
    const config = [
        // NOTE: colors without hash
        // Inactive color, char determined by typeCode
        { fillColor: 'dde6e9', textColor: '131e26' }, // Gray fill, black textColor
        { fillColor: '37bc9b', char: 'R', textColor: 'd8d5e2' }, // Green fill, white textColor
        { fillColor: 'fa8080', char: 'A', textColor: 'd8d5e2' }, // Red fill, white textColor
        { fillColor: '23b7e5', char: 'W', textColor: 'd8d5e2' }, // Blue fill, white textColor
        { fillColor: 'fad732', char: 'E', textColor: '3a3f51' }, // Yellow fill, dark gray textColor
    ];
    return entity.isInactive ? {
      ...config[entity.typeCode],
      ...config[0],
      } : {
      ...config[entity.typeCode]
    };
  }

  private createPopup<T>(map: google.maps.Map, marker: google.maps.Marker,
      markerDef: IMarker<T>): PopupComponentRefGetter<T> {
    let el: HTMLElement, compRef: ComponentRef<IMarker<T>>;
    const popup = new google.maps.InfoWindow();
    marker.addListener('click', () => {
      this.zone.run(() => {
        if (compRef) {
          compRef.destroy();
        }
        const result = this.popupService.render<IMarker<T>>(markerDef.popup, markerDef.data, markerDef.tpl);
        el = result.el;
        compRef = result.compRef;
        popup.setContent(el);
        popup.open(map, marker);
        compRef.changeDetectorRef.detectChanges();
      });
    });
    popup.addListener('closeclick', _ => {
      if (compRef) {
        compRef.destroy();
      }
    });
    return () => compRef;
  }

  private load(onLoad: EventListener, onError: EventListener, libraries: Libraries[] = [ 'drawing' ], ): void {
    this.unload(onLoad, onError);
    const scriptEl = document.createElement('script');
    scriptEl.id = 'google-maps-library';
    scriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=${libraries.join()}`;
    scriptEl.addEventListener('load', onLoad);
    scriptEl.addEventListener('error', onError);
    document.body.appendChild(scriptEl);
  }

  private unload(onLoad: EventListener, onError: EventListener): void {
    const libraryEl = document.body.querySelector('#google-maps-library');
    if (libraryEl) {
      libraryEl.removeEventListener('load', onLoad);
      libraryEl.removeEventListener('error', onError);
      libraryEl.parentElement.removeChild(libraryEl);
    }
  }

  private initMap(config: IMapOptions): any {
    const { el, ...options } = config;
    return new google.maps.Map(el, options);

  }

}
