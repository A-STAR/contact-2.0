import { Component, Input } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { ITerm } from '../terms.interface';
import { IDict } from '../../dict/dict.interface';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html'
})
export class TermEditComponent extends EntityBaseComponent<ITerm> {

  @Input() masterEntity: IDict;

  constructor(private gridService: GridService) {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
    const dictCode: number = this.masterEntity.code;
    return [
      {
        label: 'terms.edit.code',
        controlName: 'code',
        type: 'number',
        required: true
      },
      {
        label: 'terms.edit.text',
        controlName: 'name',
        type: 'text',
      },
      {
        label: 'terms.edit.type',
        controlName: 'typeCode',
        type: 'select',
        required: true,
        // TODO Duplication
        options: [
          { label: 'dictionaries.types.system', value: 1 },
          { label: 'dictionaries.types.client', value: 2 },
        ]
      },
      {
        label: 'terms.edit.parent',
        controlName: 'parentCode',
        type: 'select',
        loadLazyItemsOnInit: true,
        lazyOptions: this.gridService.read(`/api/dictionaries/${dictCode}/terms`)
          .map(
            (data: { terms: Array<ITerm> }) => data.terms.map(dict => ({ label: dict.name, value: dict.id }))
          ),
        optionsActions: [
          { text: 'terms.edit.select.type', type: SelectionActionTypeEnum.SORT }
        ]
      },
      {
        label: 'terms.edit.closed',
        controlName: 'isClosed',
        type: 'checkbox'
      },
    ];
  }
}
