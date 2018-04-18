import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IControlCmpContext } from '@app/core/map-providers/map-providers.interface';

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss']
})
export class MapToolbarComponent<T> implements OnInit, OnDestroy {
  @Input() context: IControlCmpContext<T>;

  constructor() { }

  ngOnInit(): void {
  }

  onAction($event: any): void {
    // tslint:disable-next-line:no-console
    console.log($event);
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line:no-console
    console.log('I was removed!');
  }

}
