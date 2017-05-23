import { Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IDict } from '../dict.interface';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { DictService } from '../dict.service';

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html'
})
export class DictEditComponent extends EntityBaseComponent<IDict> {

  constructor(private dictService: DictService) {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'dictionaries.edit.code',
        controlName: 'code',
        type: 'number',
        required: true
      },
      {
        label: 'dictionaries.edit.name',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'dictionaries.edit.type',
        controlName: 'type',
        type: 'select',
        cachingOptions: true,
        lazyOptions: this.dictService.getDictTypes(),
        required: true
      },
      {
        label: 'dictionaries.edit.parent',
        controlName: 'parent',
        type: 'select',
        lazyOptions: this.dictService.getDictList(),
        optionsActions: [
          { text: '', type: SelectionActionTypeEnum.SORT }
        ]
      }
    ];
  }
}
