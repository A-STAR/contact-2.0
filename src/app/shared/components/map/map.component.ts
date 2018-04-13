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
import { IMapService, IMarker, PopupComponentRefGetter, IMapOptions } from './map.interface';

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
  @Input() options: IMapOptions;

  @Input() styles: CSSStyleDeclaration;

  map: any;
  private popups: PopupComponentRefGetter<T>[];

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    const options = this.options || {
      zoom: 6,
      center: {
        lat: 55.724303,
        lng: 37.609522
      }
    };
    this.mapService
      .init(
        {
          el: this.mapEl.nativeElement,
          ...options,
        }
      )
      .subscribe((map: any) => {
        this.map = map;
        this.addMarkers(this.markers);
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
        .map(marker => this.mapService.createMarker<T>(this.map, marker).popupRef)
        .filter(Boolean);
    }
  }

}
