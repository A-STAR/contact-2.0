import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IGridFilterType, IGridSelectionType } from '@app/shared/components/grids/grids.interface';
import { IMetadataEntityGridConfig } from '@app/routes/ui/grids/entity-grid/entity-grid.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

interface IRow {
  id: number;
  foo: string;
  bar: string;
  dict: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-grids',
  templateUrl: './grids.component.html'
})
export class GridsComponent {
  columns: ISimpleGridColumn<IRow>[] = [
    {
      label: 'ID',
      prop: 'id',
      filter: IGridFilterType.NUMBER,
    },
    {
      label: 'Foo',
      prop: 'foo',
      filter: IGridFilterType.TEXT,
    },
    {
      label: 'Bar',
      prop: 'bar',
      filter: IGridFilterType.TEXT,
    },
    {
      label: 'Dict',
      prop: 'dict',
      dictCode: 1,
    }
  ];

  rows: IRow[] = Array(900).fill(null).map((_, i) => i + 1).map(id => ({
    id,
    foo: `Foo ${id}`,
    bar: `Bar ${id}`,
    dict: id % 4 + 1,
  }));

  config: IMetadataEntityGridConfig = {
    apiKey: '/formula',
    entityKey: 'formulas',
    translationKey: 'routes.utilities',
    persistenceKey: '[grid] utilities/formulas',
    selectionType: IGridSelectionType.SINGLE,
    actions: [
      { type: 'add', permissions: ['FORMULA_EDIT'] },
      { type: 'edit', permissions: ['FORMULA_EDIT'] },
      { type: 'delete', permissions: ['FORMULA_EDIT'] },
      { type: 'refresh', permissions: ['FORMULA_VIEW'], params: { refreshEvent: 'MESSAGE_FORMULA_SAVED' } },
      { type: 'calculate', permissions: ['FORMULA_CALCULATE'] }
    ],
    columns: [
      { prop: 'id' },
      { prop: 'name' },
      { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_FORMULA_TYPE },
      { prop: 'comment' },
    ] as any[]
  };
}
