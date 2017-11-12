import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IContractorManager } from '../../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../../core/converter/value-converter.interface';
import { UnsafeAction } from '../../../../../../core/state/state.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';


import { MessageBusService } from '../../../../../../core/message-bus/message-bus.service';

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
  private needToGoBack$ =  new BehaviorSubject<string>(null);
  private closeDialogSubscription: Subscription;

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private router: Router,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userDictionariesService: UserDictionariesService,
  ) {
    // TODO(d.maltsev): stronger typing
    const { value } = this.activatedRoute.params as any;
    this.contractorId = value.id;
    this.managerId = value.managerId;

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_BRANCHES),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.contractorId && this.managerId
        ? this.contractorsAndPortfoliosService.readManager(this.contractorId, this.managerId)
        : Observable.of(null)
    )
    // TODO(d.maltsev): handle errors
    .take(1)
    .subscribe(([ branchesOptions, genderOptions, manager ]) => {
      this.initFormControls(branchesOptions, genderOptions);
      this.formData = manager;
    });

    this.needToGoBack$
      .filter(Boolean)
      .subscribe(() => this.onBack());
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const manager = this.getManagerFromFormData();
    this.closeDialogSubscription = ((this.contractorId && this.managerId)
      ? this.contractorsAndPortfoliosService
          .updateManager( this.contractorId, this.managerId, manager)
      : this.contractorsAndPortfoliosService
          .createManager(this.contractorId, manager))
          .subscribe(() => {
            this.messageBusService.dispatch(ContractorsAndPortfoliosService.MANAGERS_FETCH);
            this.onBack();
          });
  }

  onBack(): void {
    this.needToGoBack$.unsubscribe();
    if (this.closeDialogSubscription) {
      this.closeDialogSubscription.unsubscribe();
    }
    this.contentTabService.gotoParent(this.router, 1);
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
      { label: 'contractors.managers.grid.email', controlName: 'email', type: 'text' },
      { label: 'contractors.managers.grid.comment', controlName: 'comment', type: 'textarea' },
    ];
  }

  private getManagerFromFormData(): IContractorManager {
    const data = this.form.value;
    return {
      ...data,
      branchCode: Array.isArray(data.branchCode) ? data.branchCode[0].value : data.branchCode,
      genderCode: Array.isArray(data.genderCode) ? data.genderCode[0].value : data.genderCode,
    };
  }
}
