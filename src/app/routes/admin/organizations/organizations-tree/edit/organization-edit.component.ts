import { Component, OnInit } from '@angular/core';

import { UserDictionaries2Service } from '../../../../../core/user/dictionaries/user-dictionaries-2.service';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOrganization } from '../../organizations.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html'
})
export class OrganizationEditComponent extends EntityBaseComponent<IOrganization> implements OnInit {
  constructor(private userDictionariesService: UserDictionaries2Service) {
    super();
  }

  ngOnInit(): void {
    this.userDictionariesService.getDictionaryAsOptions(UserDictionaries2Service.DICTIONARY_BRANCHES)
      .subscribe(options => this.controls = this.buildControls(options));
  }

  get title(): string {
    return this.editedEntity ? 'organizations.organizations.edit.title' : 'organizations.organizations.create.title';
  }

  toSubmittedValues(organization: any): IOrganization {
    return {
      ...organization,
      boxColor: Array.isArray(organization.boxColor) ? organization.boxColor[0].value : organization.boxColor,
      branchCode: Array.isArray(organization.branchCode) ? organization.branchCode[0].value : organization.branchCode
    };
  }

  protected buildControls(branchOptions: Array<IOption>): Array<IDynamicFormControl> {
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
      { label: 'organizations.organizations.edit.branchCode', controlName: 'branchCode', type: 'select', options: branchOptions },
      { label: 'organizations.organizations.edit.comment', controlName: 'comment', type: 'text' },
      { label: 'organizations.organizations.edit.boxColor', controlName: 'boxColor', type: 'select', ...colorOptions },
    ];
  }

  protected getControls(): Array<IDynamicFormControl> {
    return null;
  }
}
