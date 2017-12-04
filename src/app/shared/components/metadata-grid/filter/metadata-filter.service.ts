import { Injectable } from '@angular/core';

import { IMetadataFilter, IMetadataFilterOption } from 'app/core/metadata/metadata.interface';
import { IFilterControl } from './metadata-filter.interface';

import { FilterOperatorType } from 'app/shared/components/grid2/filter/grid-filter';
import { TControlTypes } from '../../form/dynamic-form/dynamic-form.interface';

@Injectable()
export class MetadataFilterService {

  getMetadataOption(metadata: IMetadataFilter, name: string): IMetadataFilterOption {
    return (metadata.addOptions || []).find(option => option.name === name);
  }

  getMetadataParam(metadata: IMetadataFilter, name: string): (string | number)[] {
    const option = this.getMetadataOption(metadata, name);
    return option && option.value;
  }

  getMetadataValue(metadata: IMetadataFilter, name: string, index: number): string | number {
    const param = this.getMetadataParam(metadata, name);
    return param && param[index];
  }

  getFilterControlType(operator: FilterOperatorType): TControlTypes {
    switch (operator) {
      case 'IN': return 'dialogmultiselectwrapper';
      default: return 'selectwrapper';
    }
  }

  createFilterControls(metadata: IMetadataFilter[]): IFilterControl[] {
    return metadata.map(filterMetadata => (<IFilterControl>{
      label: `default.filters.fields.${filterMetadata.column}`,
      controlName: filterMetadata.column,
      type: this.getFilterControlType(this.getMetadataValue(filterMetadata, 'operator', 0) as FilterOperatorType),
      filterType: filterMetadata.type,
      filterParams: { directionCodes: this.getMetadataParam(filterMetadata, 'direction') },
      dictCode: this.getMetadataValue(filterMetadata, 'dictCode', 0) as number,
      operator: (this.getMetadataValue(filterMetadata, 'operator', 0) || '==') as FilterOperatorType,
      width: 3,
    }));
  }
}
