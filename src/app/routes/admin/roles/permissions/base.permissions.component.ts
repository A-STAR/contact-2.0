import { DatePipe } from '@angular/common';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';

export class BasePermissionsComponent {

  constructor(public dataSource: IDataSource,
              private datePipe: DatePipe) {
  }

  // TODO Eliminate duplication
  parseFn = (data) => {
    const {dataKey} = this.dataSource;
    const dataSet = data[dataKey];
    if (!dataSet) {
      return [];
    }
    return dataSet.map(val => this.toRawValue(val));
  }

  toRawValue(val) {
    switch (val.typeCode) {

      case 1:
        val.value = val.valueN;
        break;
      case 2:
        val.value = this.datePipe.transform(new Date(val.valueD), 'dd.MM.yyyy HH:mm:ss');
        break;
      case 3:
        val.value = val.valueS || '';
        break;
      case 4:
        val.value = val.valueB;
        break;
      default:
        val.value = '';
    }
    return val;
  }

  toBooleanColumnValue(val) {
    if (val.typeCode === 4) {
      return Boolean(parseInt(val.value as string, 10));
    }
    return val.value;
  }
}
