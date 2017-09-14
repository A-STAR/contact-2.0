import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IAttribute } from '../attribute.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent {
  private words1 = [
    'adorable',
    'beautiful',
    'clean',
    'drab',
    'elegant',
    'fancy',
    'glamorous',
    'handsome',
    'long',
    'magnificent',
    'old-fashioned',
    'plain',
    'quaint',
    'sparkling',
    'ugliest',
    'unsightly',
    'wide-eyed',
  ];

  private words2 = [
    'angry',
    'bewildered',
    'clumsy',
    'defeated',
    'embarrassed',
    'fierce',
    'grumpy',
    'helpless',
    'itchy',
    'jealous',
    'lazy',
    'mysterious',
    'nervous',
    'obnoxious',
    'panicky',
    'repulsive',
    'scary',
    'thoughtless',
    'uptight',
    'worried',
  ];

  private words3 = [
    'bear',
    'cat',
    'chinchilla',
    'collie',
    'cow',
    'coyote',
    'crocodile',
    'donkey',
    'dragon',
    'duck',
    'fish',
    'fox',
    'gecko',
    'hamster',
    'hippopotamus',
    'jaguar',
    'lion',
    'lynx',
    'monkey',
    'octopus',
    'penguin',
    'pig',
    'squirrel',
    'tiger',
    'tortoise',
    'wolf',
  ];

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
    const w1 = this.randomElement(this.words1);
    const w2 = this.randomElement(this.words2);
    const w3 = this.randomElement(this.words3);
    return {
      data: {
        id,
        name: this.capitalizeFirstLetter(`${w2} ${w3}`),
        type: this.capitalizeFirstLetter(`${w1} ${w2} ${w3}`)
      },
      children: this.random(10) === 0 ? this.generateGridTreeRows(5, id, length) : undefined
    };
  }

  private random(max: number): number {
    return Math.floor(max * Math.random());
  }

  private randomElement<T>(array: Array<T>): T {
    return array[this.random(array.length)];
  }

  private capitalizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
