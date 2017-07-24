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

  toSubmittedValues(organization: any): IOrganization {
    return {
      ...organization,
      boxColor: Array.isArray(organization.boxColor) ? organization.boxColor[0].value : organization.boxColor
    };
  }

  protected getControls(): Array<IDynamicFormControl> {
    const colorOptions = {
      options: [
        { value: '',     label: 'default.colors.transparent' },
        { value: '#dff', label: 'default.colors.azure' },
        { value: '#edf', label: 'default.colors.violet' },
        { value: '#eed', label: 'default.colors.olive' },
        { value: '#efd', label: 'default.colors.lime' },
        { value: '#fde', label: 'default.colors.fuchsia' },
        { value: '#fed', label: 'default.colors.orange' },
        { value: '#fef', label: 'default.colors.pink' },
        { value: '#ffd', label: 'default.colors.yellow' },
      ],
      optionsRenderer: (label, item) => {
        return `<span style="background: ${item.value}; display: inline-block; width: 10px; height: 10px;"></span> ${label}`;
      }
    };

    return [
      { label: 'organizations.organizations.edit.name', controlName: 'name', type: 'text', required: true },
      // { label: 'organizations.organizations.edit.branchCode', controlName: 'branchCode', type: 'select' },
      { label: 'organizations.organizations.edit.comment', controlName: 'comment', type: 'text' },
      { label: 'organizations.organizations.edit.boxColor', controlName: 'boxColor', type: 'select', ...colorOptions },
    ];
  }
}
