import { Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IPermissionRole } from '../../roles-and-permissions.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';

import { RolesService } from '../roles.service';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends EntityBaseComponent<IPermissionRole> {
  constructor(private rolesService: RolesService) {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'roles.roles.copy.originalRoleName',
        controlName: 'originalRoleId',
        type: 'select',
        required: true,
        cachingOptions: true,
        loadLazyItemsOnInit: true,
        lazyOptions: this.rolesService.getRolesList(),
        optionsActions: [
          {text: 'roles.roles.copy.select.title', type: SelectionActionTypeEnum.SORT}
        ]
      },
      {
        label: 'roles.roles.copy.roleName',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'roles.roles.copy.roleComment',
        controlName: 'comment',
        type: 'textarea',
        rows: 2
      },
    ];
  }

  get formData(): any {
    return {
      originalRoleId: [{ value: this.editedEntity.id, label: this.editedEntity.name }]
    };
  }
}
