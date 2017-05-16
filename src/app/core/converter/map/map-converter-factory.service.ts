import { Injectable } from '@angular/core';
import { GridService } from '../../../shared/components/grid/grid.service';
import { MapConverterService } from './map-converter.service';

@Injectable()
export class MapConverterFactoryService {
  constructor(private gridService: GridService) {}

  public create(url: string, params: {}, dataKey: string, key: string = 'id', value: string = 'name'): MapConverterService {
    return new MapConverterService(this.gridService, key, value, url, params, dataKey);
  }
}
