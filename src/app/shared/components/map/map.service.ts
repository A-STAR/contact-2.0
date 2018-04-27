import { Injectable, Inject } from '@angular/core';

import {
  IMapService,
  LayerType,
  ILayer,
  ILayerDef,
} from '@app/core/map-providers/map-providers.interface';

import { IncId } from '@app/core/utils';
import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

@Injectable()
export class LayersService<T> {
  private groups: LayerGroup<T>[] = [];

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService<T>
  ) {}

  show(): void {
    this.groups.forEach(g => g.show());
  }

  hide(): void {
    this.groups.forEach(g => g.hide());
  }

  createGroup(layersConfig: ILayerDef<T>[]): LayerGroup<T> {
    const group = new LayerGroup<T>(this.mapService, layersConfig);
    this.groups.push(group);
    return group;
  }

  getGroups(): LayerGroup<T>[] {
    return this.groups;
  }

  getGroupById(id: number): LayerGroup<T> {
    return this.groups.find(g => g.id === id);
  }

  removeGroupById(id: number): void {
    const groupIndex = this.groups.findIndex(g => g.id === id);
    if (groupIndex !== -1) {
      const group = this.groups[groupIndex];
      group.clear();
      this.groups.splice(groupIndex, 1);
    }
  }

  clear(): void {
    this.groups.forEach(g => g.clear());
    this.groups = [];
  }

}

class LayerGroup<T> {
  private layers: Map<LayerType, ILayer<T>[]> = new Map();
  id: number;

  constructor(private mapService: IMapService<T>, config: ILayerDef<T>[]) {
    this.id = IncId.get().uuid;
    config.forEach(c => this.createLayer(c));
  }

  show(): void {
    this.getLayers().forEach(l => this.mapService.addToMap(l));
  }

  hide(): void {
    this.getLayers().forEach(l => this.mapService.removeFromMap(l));
  }

  showByIds(ids: number[]): void {
    ids.forEach(id => {
      const layer = this.getLayerById(id);
      if (layer) {
        this.mapService.addToMap(layer);
      }
    });
  }

  hideByIds(ids: number[]): void {
    ids.forEach(id => {
      const layer = this.getLayerById(id);
      if (layer) {
        this.mapService.removeFromMap(layer);
      }
    });
  }

  createLayer(layerDef: ILayerDef<T>): void {
    const layer = this.mapService.createLayer(layerDef);
    layer.id = IncId.get().uuid;
    this.addLayer(layer);
  }

  addLayer(layer: ILayer<T>): void {
    if (!this.layers.has(layer.type)) {
      this.layers.set(layer.type, [ layer ]);
    } else {
      const layers = this.layers.get(layer.type);
      if (!layers.includes(layer)) {
        layers.push(layer);
      }
    }
  }

  removeLayer(layer: ILayer<T>): void {
    if (this.layers.has(layer.type)) {
      const layers = this.layers.get(layer.type);
      const layerIndex = layers.findIndex(l => l.id === layer.id);
      if (layerIndex !== -1) {
        layers.splice(layerIndex, 1);
        this.mapService.removeFromMap(layers[layerIndex]);
      }
    }
  }

  removeLayerById(id: number): void {
    const layer = this.getLayerById(id);
    if (layer) {
      this.removeLayer(layer);
    }
  }

  getLayers(): ILayer<T>[] {
    return Array.from(this.layers.values()).reduce((acc, layers) => acc.concat(layers), []);
  }

  getLayersByType(layerType: LayerType): ILayer<T>[] {
    return this.layers.get(layerType);
  }

  getLayerById(id: number): ILayer<T> {
    return this.getLayers().find(l => l.id === id);
  }

  clear(): void {
    this.getLayers().forEach(l => this.mapService.removeFromMap(l));
    this.layers.clear();
  }
}
