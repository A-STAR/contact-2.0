import {
  Component,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IPermissionRole } from '../../permissions.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { ILabeledValue } from '../../../../../core/converter/value/value-converter.interface';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { PermissionsService } from '../../permissions.service';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends EntityBaseComponent<IPermissionRole> implements OnDestroy {

  private roles: ILabeledValue[];
  private rolesSubscription: Subscription;

  constructor(permissionsService: PermissionsService) {
    super();
    this.rolesSubscription = permissionsService.roles.subscribe((rolesList: IPermissionRole[]) => {
      this.roles = rolesList
        .map(
          (role: IPermissionRole) => ({label: role.name, value: role.id})
        );
    });
  }

  get formData(): any {
    return {
      originalRoleId: [{ value: this.editedEntity.id, label: this.editedEntity.name }]
    };
  }

  ngOnDestroy(): void {
    this.rolesSubscription.unsubscribe();
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'roles.roles.copy.originalRoleName',
        controlName: 'originalRoleId',
        type: 'select',
        required: true,
        options: this.roles,
        optionsActions: [
          { text: 'roles.roles.copy.select.title', type: SelectionActionTypeEnum.SORT }
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

}
