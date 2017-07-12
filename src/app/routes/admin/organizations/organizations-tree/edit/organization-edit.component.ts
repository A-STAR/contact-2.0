import { Component } from '@angular/core';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOrganization } from '../../organizations.interface';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html'
})
export class OrganizationEditComponent extends EntityBaseComponent<IOrganization> {
  get title(): string {
    return this.editedEntity ? 'organizations.organizations.edit.title' : 'organizations.organizations.create.title';
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      { label: 'organizations.organizations.edit.name', controlName: 'name', type: 'text', required: true },
      // { label: 'organizations.organizations.edit.branchCode', controlName: 'branchCode', type: 'select' },
      { label: 'organizations.organizations.edit.comment', controlName: 'comment', type: 'text' },
      // TODO: color picker
      { label: 'organizations.organizations.edit.boxColor', controlName: 'boxColor', type: 'text' },
    ];
  }
}
