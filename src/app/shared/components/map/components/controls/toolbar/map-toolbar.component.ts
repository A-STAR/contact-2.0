import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IControlCmpContext } from '@app/core/map-providers/map-providers.interface';
import { IMapToolbarItem } from './map-toolbar.interface';

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss']
})
export class MapToolbarComponent implements OnInit, OnDestroy {
  @Input() context: IControlCmpContext<IMapToolbarItem[]>;

  constructor() { }

  ngOnInit(): void {
  }

  isDisabled(item: IMapToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
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
