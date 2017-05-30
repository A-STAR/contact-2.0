import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/form/select/select-interfaces';
import { IRole } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends AbstractRolesPopup implements OnInit {
  @Input() originalRole: IRole = null;

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

  protected getData(): any {
    return {
      ...this.role,
      originalRoleId: [{ value: this.originalRole.id, label: this.originalRole.name }]
    };
  }

  protected httpAction(): Observable<any> {
    // TODO replace with the event based approach
    return this.rolesService.copyRole({
      ...this.form.value,
      originalRoleId: this.form.value.originalRoleId[0].value
    });
  }
}
