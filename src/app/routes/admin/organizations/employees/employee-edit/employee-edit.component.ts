import { Component } from '@angular/core';

import { IRolesResponse } from '../../../roles/roles/roles.interface';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { IEmployee } from '../../organizations.interface';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent extends EntityBaseComponent<IEmployee> {
  constructor(private gridService: GridService) {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
    const roleSelectOptions = {
      cachingOptions: true,
      lazyOptions: this.gridService
        .read('/api/roles')
        .map((data: IRolesResponse) => data.roles.map(role => ({ label: role.name, value: role.id }))),
      optionsActions: [
        { text: 'users.select.role.title', type: SelectionActionTypeEnum.SORT}
      ]
    };

    return [
      { label: 'id', controlName: 'userId', type: 'hidden', required: true },
      { label: 'users.edit.lastName', controlName: 'lastName', type: 'text', required: true },
      { label: 'users.edit.firstName', controlName: 'firstName', type: 'text' },
      { label: 'users.edit.middleName', controlName: 'middleName', type: 'text' },
      { label: 'users.edit.position', controlName: 'position', type: 'text' },
      { label: 'users.edit.email', controlName: 'email', type: 'text' },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
      /*
      {
        label: 'users.edit.role',
        controlName: 'roleCode',
        type: 'select',
        required: true,
        loadLazyItemsOnInit: true,
        // FIXME
        disabled: false,
        ...roleSelectOptions
      },
      */
      { label: 'users.edit.comment', controlName: 'comment', type: 'text', required: true }
    ].map((control: IDynamicFormControl) => ({
      ...control,
      // FIXME
      disabled: false
    }));
  }
}
