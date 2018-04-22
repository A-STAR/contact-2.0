import {
  Component,
  Inject,
  InjectionToken,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DoCheck
} from '@angular/core';
import { IMapService, IMarker, PopupComponentRefGetter, IMapOptions, ILatLng } from './map.interface';

export const MAP_SERVICE = new InjectionToken<IMapService>('MAP_SERVICE');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  host: { class: 'full-size' },
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent<T> implements AfterViewInit, DoCheck {
  @ViewChild('container') private mapEl: ElementRef;

  @Input() markers: IMarker<T>[];
  @Input() options: IMapOptions = {
    zoom: 6,
    center: {
      lat: 55.724303,
      lng: 37.609522
    },
  };

  @Input() styles: CSSStyleDeclaration;

  map: any;
  private popups: PopupComponentRefGetter<T>[];
  private bounds;

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.mapService
      .init(
        {
          el: this.mapEl.nativeElement,
          ...this.options,
        }
      )
      .subscribe((map: any) => {
        this.map = map;
        this.bounds = this.mapService.createBounds([ this.options.center, this.options.center ]);
        this.addMarkers(this.markers);
        this.fitBounds();
        this.detectPopupsChanges();
        this.cdRef.markForCheck();
      });
  }

  ngDoCheck(): void {
    this.detectPopupsChanges();
  }

  detectPopupsChanges(): void {
    if (this.popups && this.popups.length) {
      this.popups
        .map(cmpRef => cmpRef())
        .filter(cmp => cmp && !cmp.changeDetectorRef['destroyed'])
        .forEach(cmp => cmp.changeDetectorRef.detectChanges());
    }
  }

  addMarkers(markers: IMarker<T>[]): void {
    if (markers && markers.length) {
      this.popups = markers
        .map(marker => this.mapService.createMarker<T>(this.map, marker))
        .map(({ popupRef, marker }) => {
          if (this.options.fitToData) {
            this.bounds.extend(this.getLatLng(marker));
          }
          return popupRef;
        })
        .filter(Boolean);
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
