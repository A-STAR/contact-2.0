import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IAttribute } from '../attribute.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent {
  private _columns: Array<IGridTreeColumn<IAttribute>> = [
    { label: 'Id', prop: 'id' },
    { label: 'Name', prop: 'name' },
    { label: 'Type', prop: 'type' },
  ];
  private _rows = this.generateGridTreeRows(100);

  get columns(): Array<IGridTreeColumn<IAttribute>> {
    return this._columns;
  }

  get rows(): Array<IGridTreeRow<IAttribute>> {
    return this._rows;
  }

  private generateGridTreeRows(length: number, parentId: number = 0, parentLength: number = 0): Array<IGridTreeRow<IAttribute>> {
    return Array(length).fill(null).map((_, i) => this.generateRow(i, length, parentId, parentLength));
  }

  private generateRow(i: number, length: number, parentId: number, parentLength: number): IGridTreeRow<IAttribute> {
    const id = parentLength * parentId + i + 1;
    return {
      data: {
        id,
        name: `Item #${id}`,
        type: ['Red', 'Green', 'Blue', 'Yellow', 'Black'][this.random(5)]
      },
      children: this.random(10) === 0 ? this.generateGridTreeRows(5, id, length) : undefined
    };
  }

  private random(max: number): number {
    return Math.floor(max * Math.random());
  }
}
