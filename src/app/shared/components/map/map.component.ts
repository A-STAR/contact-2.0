import {
  Component,
  Inject,
  InjectionToken,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ComponentRef,
  DoCheck
} from '@angular/core';
import { IMapService, IMarker } from './map.interface';

export const MAP_SERVICE = new InjectionToken<IMapService>('MAP_SERVICE');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  host: { class: 'full-size' },
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, DoCheck {
  @ViewChild('container') private mapEl: ElementRef;

  @Input() markers: IMarker[];
  @Input() styles: CSSStyleDeclaration;

  map: any;
  private popups: ComponentRef<IMarker>[];

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
        this.addMarkers();
      });
  }

  ngDoCheck(): void {
    if (this.popups && this.popups.length) {
      this.popups
        .filter(Boolean)
        .forEach(cmpRef => cmpRef.changeDetectorRef.detectChanges());
    }
  }

  addMarkers(): void {
    if (this.markers && this.markers.length) {
      this.popups = this.markers
        .map(marker => this.mapService.createMarker(this.map, marker).popupRef)
        .filter(Boolean);
    }
  }

}
