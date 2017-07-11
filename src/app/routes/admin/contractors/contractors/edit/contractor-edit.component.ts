import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IContractor } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOption } from '../../../../../core/converter/value/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html'
})
export class ContractorEditComponent {
  static COMPONENT_NAME = 'ContractorEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractor = null;

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {
    // TODO(d.maltsev): stronger typing
    const contractorId = Number((this.activatedRoute.params as any).value.id);
    this.contractorsAndPortfoliosService.fetchContractor(contractorId);

    Observable.combineLatest(
      this.actions.ofType(ContractorsAndPortfoliosService.CONTRACTORS_FETCH_SUCCESS).map(action => action.payload.contractor),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE),
      this.lookupService.userOptions,
    )
    // TODO(d.maltsev): handle errors
    .take(1)
    .subscribe(([ contractor, contractorTypeOptions, userOptions ]) => {
      this.initFormControls(contractorTypeOptions, userOptions);
      this.formData = contractor;
    });

    this.userDictionariesService.preload([ UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE ]);
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    console.log('Submitting...');
    console.log(this.form.data);
  }

  onClose(): void {
    this.contentTabService.navigate('/admin/contractors');
  }

  private initFormControls(contractorTypeOptions: Array<IOption>, userOptions: Array<IOption>): void {
    this.controls = [
      { label: 'contractors.grid.name', controlName: 'name', type: 'text', required: true },
      { label: 'contractors.grid.fullName', controlName: 'fullName', type: 'text', required: true },
      { label: 'contractors.grid.smsName', controlName: 'smsName', type: 'text' },
      { label: 'contractors.grid.responsibleId', controlName: 'responsibleId', type: 'select', options: userOptions },
      { label: 'contractors.grid.typeCode', controlName: 'typeCode', type: 'select', options: contractorTypeOptions },
      { label: 'contractors.grid.phone', controlName: 'phone', type: 'text' },
      { label: 'contractors.grid.address', controlName: 'address', type: 'text' },
      { label: 'contractors.grid.comment', controlName: 'comment', type: 'textarea' },
    ];
  }
}
