import { Component, Inject, InjectionToken, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { IMapService } from './map.interface';

export const MAP_SERVICE = new InjectionToken<IMapService>('MAP_SERVICE');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  host: { class: 'full-size' },
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('container') private mapEl: ElementRef;

  @Input() styles: CSSStyleDeclaration;

  map: any;

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService,
  ) { }

  ngAfterViewInit(): void {
    this.mapService
      .init(
        {
          el: this.mapEl.nativeElement,
          zoom: 18,
          center: {
            lat: 55.724303,
            lng: 37.609522
          }
        }
      )
      .subscribe((map: any) => {
        this.map = map;
        this.mapService.createMarker(this.map, {
          lat: 55.724303,
          lng: 37.609522
        });
      });
  }

}
