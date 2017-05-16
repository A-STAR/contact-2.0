import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
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
        // TODO: select options lazy loading
        options: [
          {
            label: this.originalRole.name,
            value: this.originalRole.id
          }
        ],
        value: this.originalRole.id
      },
      {
        label: 'Название',
        controlName: 'name',
        type: 'text',
        required: true,
        value: this.role.name
      },
      {
        label: 'Комментарий',
        controlName: 'comment',
        type: 'textarea',
        rows: 2,
        value: this.role.name
      },
    ];
  }

  protected httpAction(): Observable<any> {
    const data = this.formValue;
    return this.gridService.create('/api/roles/{id}/copy', { id: data.originalRoleId }, data);
  }
}
