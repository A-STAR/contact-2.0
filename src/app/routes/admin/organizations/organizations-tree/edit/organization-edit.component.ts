import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IOrganization } from '../../organizations.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { EntityBaseComponent } from '../../../../../shared/components/entity/base.component';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html'
})
export class OrganizationEditComponent extends EntityBaseComponent<IOrganization> implements OnInit {
  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_BRANCHES)
      .subscribe(options => {
        this.controls = this.buildControls(options);
        this.cdRef.markForCheck();
      });
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
    return [
      { label: 'organizations.organizations.edit.name', controlName: 'name', type: 'text', required: true },
      { label: 'organizations.organizations.edit.branchCode', controlName: 'branchCode', type: 'select', options: branchOptions },
      { label: 'organizations.organizations.edit.comment', controlName: 'comment', type: 'text' },
      { label: 'organizations.organizations.edit.boxColor', controlName: 'boxColor', type: 'colorpicker' },
    ];
  }

  protected getControls(): Array<IDynamicFormControl> {
    return null;
  }
}
