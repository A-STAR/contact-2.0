import { Pipe, PipeTransform } from '@angular/core';

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';

@Pipe({name: 'rawDataFilter'})
export class RawDataFilterPipe implements PipeTransform {

  public transform(value: ILabeledValue[], params: { sortType: string }): ILabeledValue[] {
    const transformedList: ILabeledValue[] = (value || []).slice();
    if (params.sortType) {
      switch (params.sortType) {
        case 'up':
          transformedList.sort((item1: ILabeledValue, item2: ILabeledValue) =>
            (item1.label || String(item1.value)).localeCompare((item2.label || String(item2.value))));
          break;
        case 'down':
          transformedList.sort((item1: ILabeledValue, item2: ILabeledValue) =>
            (item2.label || String(item2.value)).localeCompare(item1.label || String(item1.value)));
          break;
      }
    }
    return transformedList;
  }
}
