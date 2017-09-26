import { Component } from '@angular/core';

import { IAttribute, IAttributeResponse } from '../attribute.interface';
import { IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IGridWrapperTreeColumn } from '../../../../components/gridtree-wrapper/gridtree-wrapper.interface';

import { AttributeService } from '../attribute.service';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html'
})
export class AttributeGridComponent {
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

  constructor(private attributeService: AttributeService) {
    this.attributeService.fetchAll().subscribe(attributes => {
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
