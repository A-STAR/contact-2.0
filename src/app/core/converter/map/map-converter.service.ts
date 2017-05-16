import { GridService } from '../../../shared/components/grid/grid.service';

export class MapConverterService {
  private dict: Array<any> = [];

  constructor(private gridService: GridService, private key: string, private value: string, url: string, params: {}, dataKey: string) {
    this.gridService
      .read(url, params)
      .subscribe(data => this.dict = data[dataKey]);
  }

  public map(value: string): string {
    const item = this.dict.find(i => i[this.key] === value);
    return item && item[this.value] || value;
  }
}
