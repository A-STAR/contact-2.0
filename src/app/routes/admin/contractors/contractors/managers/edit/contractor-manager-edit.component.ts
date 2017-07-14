import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IContractorManager } from '../../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOption } from '../../../../../../core/converter/value/value-converter.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-contractor-manager-edit',
  templateUrl: './contractor-manager-edit.component.html'
})
export class ContractorManagerEditComponent {
  static COMPONENT_NAME = 'ContractorManagerEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractorManager = null;

  private contractorId: number;
  private managerId: number;

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userDictionariesService: UserDictionariesService,
  ) {
    // TODO(d.maltsev): stronger typing
    const { value } = this.activatedRoute.params as any;
    this.contractorId = value.id;
    this.managerId = value.managerId;

    this.contractorsAndPortfoliosService.fetchManager(this.contractorId, this.managerId);

    Observable.combineLatest(
      this.actions.ofType(ContractorsAndPortfoliosService.MANAGERS_FETCH_SUCCESS).map(action => action.payload.manager),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_BRANCHES),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_GENDER),
    )
    // TODO(d.maltsev): handle errors
    .take(1)
    .subscribe(([ manager, branchesOptions, genderOptions ]) => {
      this.initFormControls(branchesOptions, genderOptions);
      this.formData = manager;
    });

    this.userDictionariesService.preload([
      UserDictionariesService.DICTIONARY_BRANCHES,
      UserDictionariesService.DICTIONARY_GENDER
    ]);
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    console.log('Submitting...');
    console.log(this.form.data);
  }

  onClose(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}/managers`);
  }

  private initFormControls(branchesOptions: Array<IOption>, genderOptions: Array<IOption>): void {
    this.controls = [
      { label: 'contractors.managers.grid.lastName', controlName: 'lastName', type: 'text', required: true },
      { label: 'contractors.managers.grid.firstName', controlName: 'firstName', type: 'text', required: true },
      { label: 'contractors.managers.grid.middleName', controlName: 'middleName', type: 'text' },
      { label: 'contractors.managers.grid.genderCode', controlName: 'genderCode', type: 'select', options: genderOptions },
      { label: 'contractors.managers.grid.position', controlName: 'position', type: 'text' },
      { label: 'contractors.managers.grid.branchCode', controlName: 'branchCode', type: 'select', options: branchesOptions },
      { label: 'contractors.managers.grid.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'contractors.managers.grid.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'contractors.managers.grid.intPhone', controlName: 'intPhone', type: 'text' },
      { label: 'contractors.managers.grid.workAddress', controlName: 'workAddress', type: 'text' },
      { label: 'contractors.managers.grid.comment', controlName: 'comment', type: 'textarea' },
    ];
  }
}
