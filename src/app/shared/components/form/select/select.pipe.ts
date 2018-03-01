import { Pipe, PipeTransform } from '@angular/core';

import { ILabeledValue } from '@app/core/converter/value-converter.interface';

@Pipe({name: 'sortOptionsPipe'})
export class SortOptionsPipe implements PipeTransform {

  transform(options: ILabeledValue[]): ILabeledValue[] {
    return (options || []).sort((item1, item2) =>
            (item1.label || '').localeCompare(item2.label || ''));
  }
}
