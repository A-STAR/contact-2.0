import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import {
  IActionType,
  IContractor
} from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorEditComponent implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'ContractorEditComponent';

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractor = null;
  canViewAttributes: boolean;
  private editedContractorSub: Subscription;
  private contractorId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const contractorId = Number(this.route.snapshot.paramMap.get('contractorId'));
    const getContractor$ = contractorId ? this.contractorsAndPortfoliosService.readContractor(contractorId) : Observable.of(null);

    this.editedContractorSub = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE),
      this.lookupService.lookupAsOptions('users'),
      getContractor$,
      this.userPermissionsService.has('ATTRIBUTE_VIEW_LIST')
    )
    .pipe(first())
    // TODO:(i.lobanov) remove canViewAttributes default value when permission will be added on BE
    .subscribe(([ contractorTypeOptions, userOptions, contractor, canViewAttributes ]) => {
      this.canViewAttributes = true;

      this.contractorId = contractor && contractor.id;

      const label = makeKey('contractors.grid');
      this.controls = [
        { label: label('name'), controlName: 'name', type: 'text', required: true },
        { label: label('fullName'), controlName: 'fullName', type: 'text', required: true },
        { label: label('smsName'), controlName: 'smsName', type: 'text' },
        { label: label('responsibleId'), controlName: 'responsibleId', type: 'select', options: userOptions },
        { label: label('typeCode'), controlName: 'typeCode', type: 'select', options: contractorTypeOptions },
        { label: label('phone'), controlName: 'phone', type: 'text' },
        { label: label('address'), controlName: 'address', type: 'text' },
        { label: label('comment'), controlName: 'comment', type: 'textarea' },
      ];
      this.formData = contractor;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.editedContractorSub) {
      this.editedContractorSub.unsubscribe();
    }
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const contractor = this.form.serializedUpdates;
    const action = this.contractorId
      ? this.contractorsAndPortfoliosService.updateContractor(this.contractorId, contractor)
      : this.contractorsAndPortfoliosService.createContractor(contractor);

    action.subscribe(() => {
      this.contractorsAndPortfoliosService.dispatch(IActionType.CONTRACTOR_SAVE);
      this.onBack();
    });
  }

  onBack(): void {
    this.router.navigate(['/admin/contractors']).then((isSuccess: boolean) => {
      if (isSuccess) {
        this.contentTabService.removeTabByPath(/\/admin\/contractors\/(.+)/);
      }
    });
  }

  onManagersClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/managers`]);
  }

  onAttributesClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/attributes`]);
  }
}
