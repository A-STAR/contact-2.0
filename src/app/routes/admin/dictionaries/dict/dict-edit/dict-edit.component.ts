import { Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IDict } from '../dict.interface';
import { EntityEditComponent } from '../../../../../shared/components/entity/edit/entity.edit.component';

@Component({
  selector: 'app-dict-edit',
  templateUrl: './dict-edit.component.html'
})
export class DictEditComponent extends EntityEditComponent<IDict> {

  constructor() {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'Название',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'Родительский словарь',
        controlName: 'parent',
        type: 'text'
      },
      {
        label: 'Тип словаря',
        controlName: 'type',
        type: 'text'
      }
    ];
  }
}
