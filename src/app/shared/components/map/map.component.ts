import {
  Component,
  Inject,
  InjectionToken,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ComponentRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { IMapService, IMarker } from './map.interface';

export const MAP_SERVICE = new InjectionToken<IMapService>('MAP_SERVICE');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  host: { class: 'full-size' },
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent<T> implements AfterViewInit {
  @ViewChild('container') private mapEl: ElementRef;

  @Input() markers: IMarker<T>[];

  @Input() styles: CSSStyleDeclaration;

  map: any;
  private popups: ComponentRef<T>[];

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService,
    private cdRef: ChangeDetectorRef,
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
        this.addMarkers(this.markers);
        this.detectPopupsChanges();
        this.cdRef.markForCheck();
      });
  }

  detectPopupsChanges(): void {
    if (this.popups && this.popups.length) {
      this.popups
        .filter(Boolean)
        .forEach(cmpRef => cmpRef.changeDetectorRef.detectChanges());
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
