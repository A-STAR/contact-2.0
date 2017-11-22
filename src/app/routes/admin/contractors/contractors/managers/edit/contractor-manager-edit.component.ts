import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IContractorManager } from '../../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { MessageBusService } from '../../../../../../core/message-bus/message-bus.service';
import { makeKey } from '../../../../../../core/utils';

const label = makeKey('contractors.managers.grid');

@Component({
  selector: 'app-contractor-manager-edit',
  templateUrl: './contractor-manager-edit.component.html'
})
export class ContractorManagerEditComponent implements OnInit {
  static COMPONENT_NAME = 'ContractorManagerEditComponent';

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractorManager = null;

  private routeParams = (<any>this.activatedRoute.params).value;
  private contractorId: number = this.routeParams.id;
  private managerId: number = this.routeParams.managerId;
  private closeDialogSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private router: Router,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userDictionariesService: UserDictionariesService,
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_BRANCHES),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.contractorId && this.managerId
        ? this.contractorsAndPortfoliosService.readManager(this.contractorId, this.managerId)
        : of(null)
    )
    .take(1)
    .subscribe(([ branchesOptions, genderOptions, manager ]) => {
      this.initFormControls(branchesOptions, genderOptions);
      this.formData = manager;
    });
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const manager = this.form.serializedUpdates;
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
    if (this.closeDialogSubscription) {
      this.closeDialogSubscription.unsubscribe();
    }
    this.contentTabService.gotoParent(this.router, 1);
  }

  private initFormControls(branchesOptions: Array<IOption>, genderOptions: Array<IOption>): void {
    this.controls = [
      { label: label('lastName'), controlName: 'lastName', type: 'text', required: true },
      { label: label('firstName'), controlName: 'firstName', type: 'text', required: true },
      { label: label('middleName'), controlName: 'middleName', type: 'text' },
      { label: label('genderCode'), controlName: 'genderCode', type: 'select', options: genderOptions },
      { label: label('position'), controlName: 'position', type: 'text' },
      { label: label('branchCode'), controlName: 'branchCode', type: 'select', options: branchesOptions },
      { label: label('mobPhone'), controlName: 'mobPhone', type: 'text' },
      { label: label('workPhone'), controlName: 'workPhone', type: 'text' },
      { label: label('intPhone'), controlName: 'intPhone', type: 'text' },
      { label: label('workAddress'), controlName: 'workAddress', type: 'text' },
      { label: label('email'), controlName: 'email', type: 'text' },
      { label: label('comment'), controlName: 'comment', type: 'textarea' },
    ];
  }
}
