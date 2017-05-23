import { Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { ITerm } from '../terms.interface';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html'
})
export class TermEditComponent extends EntityBaseComponent<ITerm> {

  constructor(private gridService: GridService) {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
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
        options: [
          { label: 'Системный', value: 1 },
          { label: 'Общий', value: 2 },
        ]
      },
      {
        label: 'terms.edit.parent',
        controlName: 'parentCode',
        type: 'text',
        lazyOptions: this.gridService.read('/api/term')
          .map(
            (data: {dicts: Array<ITerm>}) => data.dicts.map(dict => ({label: dict.name, value: dict.id}))
          ),
        optionsActions: [
          { text: 'Тип термина', type: SelectionActionTypeEnum.SORT }
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