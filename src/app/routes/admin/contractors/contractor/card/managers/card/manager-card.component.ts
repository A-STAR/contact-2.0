import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IContractorManager, IActionType } from '@app/routes/admin/contractors/contractors-and-portfolios.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('contractors.managers.grid');

@Component({
  selector: 'app-manager-card',
  templateUrl: './manager-card.component.html'
})
export class ManagerCardComponent implements OnInit {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractorManager = null;

  private routeParams = (<any>this.activatedRoute.params).value;
  private contractorId: number = this.routeParams.contractorId;
  private managerId: number = this.routeParams.managerId;

  constructor(
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_BRANCHES),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.contractorId && this.managerId
        ? this.contractorsAndPortfoliosService.readManager(this.contractorId, this.managerId)
        : of(null)
    )
    .pipe(first())
    .subscribe(([ branchesOptions, genderOptions, manager ]) => {
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
      this.formData = manager;
      this.cdRef.markForCheck();
    });
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const manager = this.form.serializedUpdates;
    const action = this.contractorId && this.managerId
      ? this.contractorsAndPortfoliosService.updateManager( this.contractorId, this.managerId, manager)
      : this.contractorsAndPortfoliosService.createManager(this.contractorId, manager);

    action.subscribe(() => {
      this.contractorsAndPortfoliosService.dispatch(IActionType.MANAGER_SAVE);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ `/app/admin/contractors/${String(this.contractorId)}/managers` ]);
  }
}
