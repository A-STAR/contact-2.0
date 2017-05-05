import {IDataSource} from '../../../shared/components/grid/grid.interface';

export interface IDisplayProperties {
  removePermit: boolean;
  addPermit: boolean;
  editPermit: boolean;
}

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
    return dataSet.map(val => {
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
    });
  }

  // TODO Eliminate duplication
  prepareData = (data) => {
    switch (data.typeCode) {
      case 1:
        data.valueN = parseInt(data.value, 10);
        break;
      case 3:
        data.valueS = data.value;
        break;
      case 4:
        data.valueB = data.value ? 1 : 0;
        break;
    }
    delete data.value;
    return data;
  }
}
