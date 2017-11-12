import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IContractor } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { UnsafeAction } from '../../../../../core/state/state.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html'
})
export class ContractorEditComponent {
  static COMPONENT_NAME = 'ContractorEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractor = null;
  needToCloseDialog$ = new BehaviorSubject<string>(null);

  private closeDialogSubscription: Subscription;
  private contractorId = Number((this.route.params as any).value.id);

  constructor(
    private actions: Actions,
    private route: ActivatedRoute,
    private router: Router,
    private messageBusService: MessageBusService,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE),
      this.lookupService.userOptions,
      this.contractorId ? this.contractorsAndPortfoliosService.readContractor(this.contractorId) : Observable.of(null)
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

    this.needToCloseDialog$
      .filter(Boolean)
      .take(1)
      .subscribe(() => this.onBack());
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const contractor = this.form.serializedUpdates;
    this.closeDialogSubscription = ((this.contractorId)
      ? this.contractorsAndPortfoliosService.updateContractor(this.contractorId, contractor)
      : this.contractorsAndPortfoliosService.createContractor(contractor))
          .subscribe(() => {
            this.messageBusService.dispatch(ContractorsAndPortfoliosService.CONTRACTOR_FETCH);
            this.needToCloseDialog$.next(' ');
          });
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 1);
  }

  onManagersClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/managers`]);
  }
}
