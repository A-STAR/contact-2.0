import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  DynamicLayoutEventType,
  IDynamicLayoutEvent,
  IDynamicLayoutPlugin,
  DynamicLayoutPluginType,
} from './event.interface';
import { IDynamicLayoutGridSelectControl } from '../dynamic-layout.interface';

import { AbstractPlugin } from './plugins/abstract';
import { GridSelectPlugin } from './plugins/gridselect';

@Injectable()
export class EventService {
  private plugins: AbstractPlugin[];

  setPlugins(formGroup: FormGroup, plugins: IDynamicLayoutPlugin[]): void {
    this.plugins = plugins.map(p => {
      switch (p.type) {
        case DynamicLayoutPluginType.GRIDSELECT:
          return new GridSelectPlugin(formGroup, p);
        default:
          throw new Error('Incorrect plugin name');
      }
    });
  }

  onGridSelect(control: IDynamicLayoutGridSelectControl, row: any): void {
    this.emitPluginEvent({ type: DynamicLayoutEventType.GRIDSELECT, control, row });
  }

  private emitPluginEvent(event: IDynamicLayoutEvent): void {
    this.plugins.forEach(p => p.handle(event));
  }
}
