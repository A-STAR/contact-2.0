import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IAttribute } from '../attribute.interface';
import { IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent {
  private _rows = this.generateGridTreeRows(100);

  get rows(): Array<IGridTreeRow<IAttribute>> {
    return this._rows;
  }

  private generateGridTreeRows(length: number): Array<IGridTreeRow<IAttribute>> {
    return Array(length).fill(null).map((_, i) => this.generateRow(i));
  }

  private generateRow(i: number): IGridTreeRow<IAttribute> {
    const id = i + 1;
    return {
      data: {
        id,
        name: `Item #${id}`,
        type: ['Red', 'Green', 'Blue', 'Yellow', 'Black'][this.random(5)]
      },
      children: this.random(10) === 0 ? this.generateGridTreeRows(5) : undefined
    };
  }

  private random(max: number): number {
    return Math.floor(max * Math.random());
  }
}
