import { Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IDict } from '../dict.interface';
import { EntityEditComponent } from '../../../../../shared/components/entity/edit/entity.edit.component';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html'
})
export class DictEditComponent extends EntityEditComponent<IDict> {

  constructor(private gridService: GridService) {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'Код словаря',
        controlName: 'code',
        type: 'number',
        required: true
      },
      {
        label: 'Название словаря',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'Тип словаря',
        controlName: 'type',
        type: 'select',
        options: [
          { label: 'Системный', value: 1 },
          { label: 'Общий', value: 2 },
        ]
      },
      {
        label: 'Родительский словарь',
        controlName: 'parent',
        type: 'text',
        lazyOptions: this.gridService.read('/api/dict')
          .map(
            (data: {dicts: Array<IDict>}) => data.dicts.map(dict => ({label: dict.name, value: dict.id}))
          ),
        optionsActions: [
          { text: 'Перечень словарей', type: SelectionActionTypeEnum.SORT }
        ]
      }
    ];
  }
}
