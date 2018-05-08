import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IControlCmpContext } from '@app/core/map-providers/map-providers.interface';
import { IMapToolbarItem, IMapToolbarActionData } from './map-toolbar.interface';

import { doOnceIf, invert } from '@app/core/utils';

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapToolbarComponent {
  @Input() context: IControlCmpContext<IMapToolbarItem[]>;

  constructor(private store: Store<IAppState>) {}

  isDisabled(item: IMapToolbarItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  onAction($event: IMapToolbarActionData): void {
    const { item } = $event;
    doOnceIf(this.isDisabled(item).map(invert), () => {
      if (typeof item.action === 'function') {
        item.action($event);
      } else if (item.action) {
        this.store.dispatch(item.action);
      }
    });
  }

}
