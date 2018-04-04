import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { } from '@types/googlemaps';

import { IMapOptions } from '../../map.interface';
import { Libraries } from './maps-google.interface';

import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class MapGoogleService {
  readonly apiKey = this.configService.config.maps.providers.google.apiKey;
  constructor(
    private configService: ConfigService,
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

  createMarker(map: google.maps.Map, latlng: google.maps.LatLng): google.maps.Marker {
    return  new google.maps.Marker({
      position: latlng,
      map
    });
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
