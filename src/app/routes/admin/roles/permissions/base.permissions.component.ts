import { IDataSource } from '../../../../shared/components/grid/grid.interface';

export class BasePermissionsComponent {

  constructor(public dataSource: IDataSource) {
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
        val.value = String(val.valueN);
        delete val.valueN;
        break;
      case 2:
        val.value = Date.parse(val.valueD);
        delete val.valueD;
        break;
      case 3:
        val.value = val.valueS;
        delete val.valueS;
        break;
      case 4:
        val.value = Boolean(val.valueB);
        delete val.valueB;
        break;
      default:
        val.value = '';
    }
    return val;
  }
}
