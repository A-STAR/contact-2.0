import { ChangeDetectorRef, Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IOrganization, IEmployeeViewEntity } from '../../organizations.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html'
})
export class OrganizationEditComponent implements OnInit {
  @Input() editedEntity: IEmployeeViewEntity;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  controls: Array<IDynamicFormControl>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

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

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const organization = this.form.serializedUpdates;
    this.submit.emit(this.toSubmittedValues(organization));
    this.onCancel();
  }

  canSubmit(): boolean {
    return (this.form && this.form.canSubmit) || false;
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
