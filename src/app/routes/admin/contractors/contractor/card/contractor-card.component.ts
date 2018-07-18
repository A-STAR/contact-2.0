import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { EntityType } from '@app/core/entity/entity.interface';
import { IActionType, IContractor } from '@app/routes/admin/contractors/contractors-and-portfolios.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

@Component({
  selector: 'app-contractor-card',
  templateUrl: './contractor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorCardComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IContractor = null;
  canViewAttributes: boolean;
  canViewManagers: boolean;
  canViewObjects: boolean;
  canViewDocuments: boolean;
  private editedContractorSub: Subscription;
  private contractorId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) { }

  ngOnInit(): void {

    const contractorId = Number(this.route.snapshot.paramMap.get('contractorId'));
    const getContractor$ = contractorId ? this.contractorsAndPortfoliosService.readContractor(contractorId) : of(null);

    this.editedContractorSub = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE),
      this.lookupService.lookupAsOptions('users'),
      getContractor$,
      this.userPermissionsService.contains('ATTRIBUTE_VIEW_LIST', EntityType.CONTRACTOR),
      this.userPermissionsService.has('OBJECT_CONTRACTOR_VIEW'),
      this.userPermissionsService.has('CONTRACTOR_MANAGER_VIEW'),
      this.userPermissionsService.contains('FILE_ATTACHMENT_VIEW_LIST', EntityType.CONTRACTOR),
    )
    .pipe(first())
    .subscribe(([
      contractorTypeOptions,
      userOptions,
      contractor,
      canViewAttributes,
      canViewObjects,
      canViewManagers,
      canViewDocuments,
    ]) => {
      this.canViewAttributes = canViewAttributes && contractor;
      this.canViewObjects = canViewObjects && contractor;
      this.canViewManagers = canViewManagers && contractor;
      this.canViewDocuments = canViewDocuments && contractor;

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
    this.routingService.navigate([ '/app/admin/contractors' ]);
  }

  onManagersClick(): void {
    this.routingService.navigate(['managers'], this.route);
  }

  onAttributesClick(): void {
    this.routingService.navigate(['attributes'], this.route);
  }

  onObjectsClick(): void {
    this.routingService.navigate(['objects'], this.route);
  }

  onDocumentsClick(): void {
    this.routingService.navigate(['documents'], this.route);
  }
}
