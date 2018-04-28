import {
  MapComponents,
  PopupComponentRefGetter,
  ControlComponentRefGetter,
} from '@app/core/map-providers/map-providers.interface';

export class MapProvider<T> {

  protected components: MapComponents<T> = [];

  constructor() { }

  removeComponents(): void {
    this.components
      .map(cmpRef => cmpRef && cmpRef())
      .forEach(cmp => {
        if (cmp && !cmp.changeDetectorRef['destroyed']) {
          cmp.destroy();
        }
      });
    this.components = [];
  }

  addComponent(component: PopupComponentRefGetter<T> | ControlComponentRefGetter<T>): void {
    this.components.push(component);
  }

}
