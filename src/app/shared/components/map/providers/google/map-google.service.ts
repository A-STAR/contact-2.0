import { Injectable, ComponentRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { } from '@types/googlemaps';

import { IMapOptions, IMarker, ICreateMarkerResult, PopupComponentRefGetter } from '../../map.interface';
import { Libraries, IMarkerIconConfig } from './maps-google.interface';

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

  private createPopup<T>(map: google.maps.Map, marker: google.maps.Marker,
      markerDef: IMarker<T>): PopupComponentRefGetter<T> {
    let el: HTMLElement, compRef: ComponentRef<IMarker<T>>;
    const popup = new google.maps.InfoWindow();
    marker.addListener('click', () => {
      this.zone.run(() => {
        if (compRef) {
          compRef.destroy();
        }
        const result = this.popupService.render<IMarker<T>>(markerDef.popup, markerDef.data);
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
