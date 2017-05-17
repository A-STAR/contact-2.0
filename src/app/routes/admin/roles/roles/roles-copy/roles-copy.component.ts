import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../../shared/components/select/select-interfaces';
import { IRoleRecord } from '../roles.interface';
import { AbstractRolesPopup } from '../roles-abstract-popup';

@Component({
  selector: 'app-roles-copy',
  templateUrl: './roles-copy.component.html'
})
export class RolesCopyComponent extends AbstractRolesPopup implements OnInit {
  @Input() originalRole: IRoleRecord = null;

  constructor(private gridService: GridService) {
    super();
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'Название оригинальной роли',
        controlName: 'originalRoleId',
        type: 'select',
        required: true,
        cachingOptions: true,
        lazyOptions: this.gridService.read('/api/roles')
          .map(
            (data: {roles: Array<IRoleRecord>}) => data.roles.map(role => ({label: role.name, value: role.id}))
          ),
        optionsActions: [
          {text: 'Выберите роль', type: SelectionActionTypeEnum.SORT}
        ]
      },
      {
        label: 'Название',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'Комментарий',
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
    }
  }

  protected httpAction(): Observable<any> {
    const data = {
      ...this.form.value,
      originalRoleId: this.form.value.originalRoleId[0].value
    };
    return this.gridService.create('/api/roles/{id}/copy', { id: data.originalRoleId }, data);
  }
}
