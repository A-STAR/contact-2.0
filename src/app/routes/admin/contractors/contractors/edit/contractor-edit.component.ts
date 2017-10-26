import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IContractor } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

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

  private contractorId = Number((this.route.params as any).value.id);

  constructor(
    private actions: Actions,
    private route: ActivatedRoute,
    private router: Router,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {
    if (this.contractorId) {
      this.contractorsAndPortfoliosService.fetchContractor(this.contractorId);
    }

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE),
      this.lookupService.userOptions,
      this.contractorId ?
        this.actions.ofType(ContractorsAndPortfoliosService.CONTRACTOR_FETCH_SUCCESS).map(action => action.payload.contractor) :
        Observable.of(null)
    )
    .take(1)
    .subscribe(([ contractorTypeOptions, userOptions, contractor ]) => {
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
      this.formData = contractor;
    });

    this.actions.ofType(
      ContractorsAndPortfoliosService.CONTRACTOR_CREATE_SUCCESS,
      ContractorsAndPortfoliosService.CONTRACTOR_UPDATE_SUCCESS
    )
    .take(1)
    .subscribe(() => this.onBack());
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const contractor = this.form.serializedUpdates;
    if (this.contractorId) {
      this.contractorsAndPortfoliosService.updateContractor(this.contractorId, contractor);
    } else {
      this.contractorsAndPortfoliosService.createContractor(contractor);
    }
  }

  onBack(): void {
    this.router.navigate(['/admin/contractors']);
  }

  onManagersClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/managers`]);
  }

}
