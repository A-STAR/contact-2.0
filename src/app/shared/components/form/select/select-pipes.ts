import { Pipe, PipeTransform } from '@angular/core';

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { escapeRegexp } from './common';

@Pipe({name: 'rawDataFilter'})
export class RawDataFilterPipe implements PipeTransform {

  public transform(value: ILabeledValue[], params: any): ILabeledValue[] { // TODO any
    const filteredValue: ILabeledValue[] = value.filter((item: ILabeledValue) =>
      !params.active.find((activeItem: ILabeledValue) => activeItem.value === item.value));

    if (params.sortType) {
      switch (params.sortType) {
        case 'up':
          filteredValue.sort((item1: ILabeledValue, item2: ILabeledValue) =>
            (item1.label || String(item1.value)).localeCompare((item2.label || String(item2.value))));
          break;
        case 'down':
          filteredValue.sort((item1: ILabeledValue, item2: ILabeledValue) =>
            (item2.label || String(item2.value)).localeCompare(item1.label || String(item1.value)));
          break;
      }
    }
    return filteredValue;
  }
}

@Pipe({name: 'highlight'})
export class HighlightPipe implements PipeTransform {
  public transform(value: string, query: string): any {
    if (query.length < 1) {
      return value;
    }

    if (query) {
      const tagRE = new RegExp('<[^<>]*>', 'ig');
      // get ist of tags
      const tagList = value.match(tagRE);
      // Replace tags with token
      const tmpValue = value.replace(tagRE, '$!$');
      // Replace search words
      value = tmpValue.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>');
      // Reinsert HTML
      for (let i = 0; value.indexOf('$!$') > -1; i++) {
        value = value.replace('$!$', tagList[i]);
      }
    }
    return value;
  }
}
