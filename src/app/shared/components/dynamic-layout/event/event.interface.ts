import { IDynamicLayoutGridSelectControl, IDynamicLayoutControl } from '../dynamic-layout.interface';


// Events

export enum DynamicLayoutEventType {
  GRIDSELECT = 'gridselect',
}

export interface IDynamicLayoutGenericEvent {
  type: DynamicLayoutEventType;
  control: IDynamicLayoutControl;
}

export interface IDynamicLayoutGridSelectEvent extends IDynamicLayoutGenericEvent {
  type: DynamicLayoutEventType.GRIDSELECT;
  control: IDynamicLayoutGridSelectControl;
  row: { [key: string]: any; };
}

export type IDynamicLayoutEvent = IDynamicLayoutGridSelectEvent;


// Plugins

export enum DynamicLayoutPluginType {
  GRIDSELECT = 'gridselect',
}

export interface IDynamicLayoutGenericPlugin {
  type: DynamicLayoutPluginType;
  // Optional
  form?: string;
}

export interface IDynamicLayoutGridSelectPlugin extends IDynamicLayoutGenericPlugin {
  type: DynamicLayoutPluginType.GRIDSELECT;
  from: string;
  to: string;
  key: string;
}

export type IDynamicLayoutPlugin = IDynamicLayoutGridSelectPlugin;
