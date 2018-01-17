import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IActionType, IContractor } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorEditComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractor = null;
  canViewAttributes: boolean;
  canViewObjects: boolean;
  private editedContractorSub: Subscription;
  private contractorId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private location: Location,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const contractorId = Number(this.route.snapshot.paramMap.get('contractorId'));
    const getContractor$ = contractorId ? this.contractorsAndPortfoliosService.readContractor(contractorId) : of(null);

    this.editedContractorSub = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE),
      this.lookupService.lookupAsOptions('users'),
      getContractor$,
      this.userPermissionsService.has('ATTRIBUTE_VIEW_LIST'),
      this.userPermissionsService.has('OBJECT_CONTRACTOR_VIEW')
    )
    .pipe(first())
    // TODO:(i.lobanov) remove canViewAttributes default value when permission will be added on BE
    // TODO:(i.kibisov) remove canViewObjects default value when permission will be added on BE
    .subscribe(([ contractorTypeOptions, userOptions, contractor, canViewAttributes, canViewObjects ]) => {
      this.canViewAttributes = true;
      this.canViewObjects = true;

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
    this.location.back();
  }

  onManagersClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/managers`]);
  }

  onAttributesClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/attributes`]);
  }

  onObjectsClick(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/objects`]);
  }
}
