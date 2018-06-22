import { Injectable, Inject } from '@angular/core';

import {
  IMapService,
  LayerType,
  ILayer,
  ILayerDef,
  GeoLayer,
} from '@app/core/map-providers/map-providers.interface';

import { IncId } from '@app/core/utils';
import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

export class Layer<T> implements ILayer<T> {

  id: number;
  isGroup = false;
  type: LayerType;
  nativeLayer: GeoLayer;
  data: any;

  constructor(private mapService: IMapService<T>, layerDef: ILayerDef<T>) {
    const layer = this.mapService.createLayer(layerDef);
    this.type = layer.type;
    this.nativeLayer = layer.nativeLayer;
    this.data = layer.data;
    this.id = IncId.get().uuid;
  }

  show(): void {
    this.mapService.addToMap(this);
  }

  hide(): void {
    this.mapService.removeFromMap(this);
  }

  remove(): void {
    this.mapService.removeFromMap(this);
  }
}

export class LayerGroup<T> {
  private layers: Map<LayerType, Layer<T>[]> = new Map();
  id: number;
  isGroup = true;

  constructor(private mapService: IMapService<T>, config: ILayerDef<T>[]) {
    this.id = IncId.get().uuid;
    config.forEach(c => this.addLayer(new Layer(this.mapService, c)));
  }

  show(): void {
    this.getLayers().forEach(l => l.show());
  }

  hide(): void {
    this.getLayers().forEach(l => l.remove());
  }

  showByIds(ids: number[]): void {
    ids.forEach(id => {
      const layer = this.getLayerById(id);
      if (layer) {
        layer.show();
      }
    });
  }

  hideByIds(ids: number[]): void {
    ids.forEach(id => {
      const layer = this.getLayerById(id);
      if (layer) {
        layer.hide();
      }
    });
  }

  addLayer(layer: Layer<T>): void {
    if (!this.layers.has(layer.type)) {
      this.layers.set(layer.type, [ layer ]);
    } else {
      const layers = this.layers.get(layer.type);
      if (!layers.includes(layer)) {
        layers.push(layer);
      }
    }
  }

  removeLayer(layer: Layer<T>): void {
    if (this.layers.has(layer.type)) {
      const layers = this.layers.get(layer.type);
      const layerIndex = layers.findIndex(l => l.id === layer.id);
      if (layerIndex !== -1) {
        layers[layerIndex].remove();
        layers.splice(layerIndex, 1);
      }
    }
  }

  removeLayerById(id: number): void {
    const layer = this.getLayerById(id);
    if (layer) {
      this.removeLayer(layer);
    }
  }

  getLayers(): Layer<T>[] {
    return Array.from(this.layers.values()).reduce((acc, layers) => acc.concat(layers), []);
  }

  getLayersByType(layerType: LayerType): Layer<T>[] {
    return this.layers.get(layerType);
  }

  getLayerById(id: number): Layer<T> {
    return this.getLayers().find(l => l.id === id);
  }

  remove(): void {
    this.getLayers().forEach(l => l.remove());
    this.layers.clear();
  }
}

@Injectable()
export class LayersService<T> {
  private _layers: Array<LayerGroup<T> | Layer<T>> = [];

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>
  ) {}

  show(): void {
    this._layers.forEach(l => l.show());
  }

  hide(): void {
    this._layers.forEach(l => l.hide());
  }

  createLayer(config: ILayerDef<T>): Layer<T> {
    const layer = new Layer<T>(this.mapService, config);
    this._layers.push(layer);
    return layer;
  }

  createGroup(config: ILayerDef<T>[]): LayerGroup<T> {
    const group = new LayerGroup<T>(this.mapService, config);
    this._layers.push(group);
    return group;
  }

  getLayers(): Array<LayerGroup<T> | Layer<T>> {
    return this._layers;
  }

  getById(id: number): LayerGroup<T> | Layer<T> {
    return this._layers.find(l => l.id === id);
  }

  removeById(id: number): void {
    const layerIndex = this._layers.findIndex(l => l.id === id);
    if (layerIndex !== -1) {
      const layer = this._layers[layerIndex];
      layer.remove();
      this._layers.splice(layerIndex, 1);
    }
  }

  clear(): void {
    this._layers.forEach(l => l.remove());
    this._layers = [];
  }

}
