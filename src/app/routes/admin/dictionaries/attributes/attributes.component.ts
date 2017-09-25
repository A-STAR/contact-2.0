import { Component } from '@angular/core';

import { IAttribute, IAttributeResponse } from './attributes.interface';
import { IGridTreeRow } from '../../../../shared/components/gridtree/gridtree.interface';
import { IGridWrapperTreeColumn } from '../../../../shared/components/gridtree-wrapper/gridtree-wrapper.interface';

import { AttributesService } from './attributes.service';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-dictionaries-attribtues',
  templateUrl: 'attributes.component.html'
})
export class AttributesComponent {
  columns: Array<IGridWrapperTreeColumn<any>> = [
    {
      label: labelKey('name'),
      prop: 'name',
    },
    {
      label: labelKey('code'),
      prop: 'code',
    },
    {
      label: labelKey('typeCode'),
      prop: 'typeCode',
      // FIXME(d.maltsev): pass number instead of function
      dictCode: () => 1,
    },
  ];
  attributes: IGridTreeRow<IAttribute>[] = [];

  constructor(private attributesService: AttributesService) {
    this.attributesService.fetchAll().subscribe(attributes => {
      this.attributes = this.convertToGridTreeRow(attributes);
    });
  }

  private convertToGridTreeRow(attributes: IAttributeResponse[]): IGridTreeRow<IAttribute>[] {
    return attributes.map(attribute => {
      const { children, ...rest } = attribute;
      const hasChildren = children && children.length > 0;
      return hasChildren
        ? { data: rest, children: this.convertToGridTreeRow(children), isExpanded: true }
        : { data: rest };
    });
  }
}
