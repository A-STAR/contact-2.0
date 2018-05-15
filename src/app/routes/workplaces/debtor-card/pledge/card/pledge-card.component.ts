import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';
import { IEmployment } from '@app/routes/workplaces/core/employment/employment.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { DYNAMIC_MODULES } from '@app/core/dynamic-loader/dynamic-loader.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PledgeCardService } from './pledge-card.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { contractFormConfig } from './config/contract-form.config';
import { pledgorFormConfig } from './config/pledgor-form.config';
import { propertyFormConfig } from './config/property-form.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-pledge-card',
  templateUrl: 'pledge-card.component.html',
})
export class PledgeCardComponent implements AfterViewInit {
  @ViewChild('contractForm') contractForm: MetadataFormComponent<any>;
  @ViewChild('pledgorForm') pledgorForm: MetadataFormComponent<any>;
  @ViewChild('propertyForm') propertyForm: MetadataFormComponent<any>;

  readonly contractFormConfig = contractFormConfig;
  readonly pledgorFormConfig = pledgorFormConfig;
  readonly propertyFormConfig = propertyFormConfig;

  readonly pledgor$ = this.pledgeCardService.pledgor$;
  readonly isPledgorFormDisabled$ = this.pledgor$.pipe(
    map(Boolean),
  );

  readonly property$ = this.pledgeCardService.property$;
  readonly isPropertyFormDisabled$ = this.property$.pipe(
    map(Boolean),
  );

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor, pledgor and property)
   */
  readonly contractId = Number(this.paramMap.get('contractId'));

  /**
   * Debt ID
   */
  readonly debtId = Number(this.paramMap.get('debtId'));

  /**
   * ID of person who is a debtor (displayed in debtor card)
   */
  readonly debtorId = Number(this.paramMap.get('debtorId'));

  /**
   * ID of person who is linked as pledgor via contractId
   */
  readonly pledgorId = Number(this.paramMap.get('pledgorId'));

  /**
   * Pledgor role (according to dictionary 44)
   */
  readonly pledgorRole = 3;

  /**
   * ID of property that is linked via contractId
   */
  readonly propertyId = Number(this.paramMap.get('propertyId'));

  readonly createMode = !this.contractId;
  readonly addPledgorMode = !!this.contractId && !this.pledgorId;
  readonly addPropertyMode = !!this.pledgorId && !this.propertyId;
  readonly editMode = !!this.propertyId;

  readonly showContractForm = this.createMode || this.editMode;
  readonly showPledgorForm = this.createMode || this.addPledgorMode || this.editMode;

  readonly contractTitlebar: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.contract.title',
  };

  readonly pledgorTitlebar: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPersonSearch(),
        enabled: of(!this.editMode),
      },
    ]
  };

  readonly propertyTitlebar: ITitlebar = {
    title: 'routes.workplaces.debtorCard.pledge.card.forms.property.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPropertySearch(),
        enabled: of(!this.editMode),
      },
    ]
  };

  constructor(
    private injector: Injector,
    private personService: PersonService,
    private pledgeCardService: PledgeCardService,
    private pledgeService: PledgeService,
    private popupOutletService: PopupOutletService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DYNAMIC_MODULES) private modules: IDynamicModule[][],
  ) {}

  get canSubmit(): boolean {
    const contractFormGroup = this.contractForm
      ? this.contractForm.formGroup
      : null;
    const pledgorFormGroup = this.pledgorForm
      ? this.pledgorForm.formGroup
      : null;
    const propertyFormGroup = this.propertyForm
      ? this.propertyForm.formGroup
      : null;
    const contractFormValid = !contractFormGroup || contractFormGroup.valid;
    const pledgorFormValid = !pledgorFormGroup || pledgorFormGroup.valid;
    const propertyFormValid = !propertyFormGroup || propertyFormGroup.valid;
    return contractFormValid && pledgorFormValid && propertyFormValid;
  }

  get title(): string {
    switch (true) {
      case this.createMode:
        return 'routes.workplaces.debtorCard.pledge.card.titles.add';
      case this.addPledgorMode:
        return 'routes.workplaces.debtorCard.pledge.card.titles.addPledgor';
      case this.addPropertyMode:
        return 'routes.workplaces.debtorCard.pledge.card.titles.addProperty';
      default:
        return 'routes.workplaces.debtorCard.pledge.card.titles.edit';
    }
  }

  ngAfterViewInit(): void {
    if (this.contractId) {
      this.fetchContract();
    }
    if (this.pledgorId) {
      this.fetchPledgor();
    }
    if (this.propertyId) {
      this.fetchProperty();
    }
  }

  onPledgorFormClear(): void {
    this.pledgeCardService.selectPledgor(null);
    this.pledgorForm.formGroup.reset();
  }

  onPropertyFormClear(): void {
    this.pledgeCardService.selectProperty(null);
    this.propertyForm.formGroup.reset();
  }

  onSave(): void {
    if (this.createMode) {
      const contractData = this.contractForm.data;
      const pledgorData = this.pledgorForm.data;
      const propertyData = this.propertyForm.data;
      this.pledgeCardService
        .createPledge(this.debtId, this.pledgorId, this.propertyId, contractData, pledgorData, propertyData)
        .subscribe(() => this.onSuccess());
    }
    if (this.addPledgorMode) {
      this.pledgeCardService
        .addPledgor(this.debtId, this.contractId, this.pledgorId, this.propertyId, this.pledgorForm.data, this.propertyForm.data)
        .subscribe(() => this.onSuccess());
    }
    if (this.addPropertyMode) {
      this.pledgeCardService
        .addProperty(this.debtId, this.contractId, this.pledgorId, this.propertyId, this.propertyForm.data)
        .subscribe(() => this.onSuccess());
    }
    if (this.editMode) {
      const contractData = this.contractForm.data;
      const pledgorData = this.pledgorForm.data;
      const propertyData = this.propertyForm.data;
      this.pledgeCardService
        .updatePledge(this.debtId, this.contractId, this.pledgorId, this.propertyId, contractData, pledgorData, propertyData)
        .subscribe(() => this.onSuccess());
    }
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }

  onPhoneAdd(): void {
    this.router.navigate([ 'phone/create' ], { relativeTo: this.route });
  }

  onPhoneEdit(phone: IPhone): void {
    this.router.navigate([ `phone/${phone.id}` ], { relativeTo: this.route });
  }

  onAddressAdd(): void {
    this.router.navigate([ 'address/create' ], { relativeTo: this.route });
  }

  onAddressEdit(address: IAddress): void {
    this.router.navigate([ `address/${address.id}` ], { relativeTo: this.route });
  }

  onIdentityAdd(): void {
    this.router.navigate([ 'identity/create' ], { relativeTo: this.route });
  }

  onIdentityEdit(document: IIdentityDoc): void {
    this.router.navigate([ `identity/${document.id}` ], { relativeTo: this.route });
  }

  onEmploymentAdd(): void {
    this.router.navigate([ 'employment/create' ], { relativeTo: this.route });
  }

  onEmploymentEdit(employment: IEmployment): void {
    this.router.navigate([ `employment/${employment.id}` ], { relativeTo: this.route });
  }

  private fetchContract(): void {
    this.pledgeService
      .fetch(this.debtId, this.contractId)
      .subscribe(contract => this.contractForm.formGroup.patchValue(contract));
  }

  private fetchPledgor(): void {
    this.personService
      .fetch(this.pledgorId)
      .subscribe(person => this.pledgorForm.formGroup.patchValue(person));
  }

  private fetchProperty(): void {
    this.propertyService
      .fetch(this.pledgorId, this.propertyId)
      .subscribe(property => this.propertyForm.formGroup.patchValue(property));
  }

  private onSuccess(): void {
    this.pledgeService.dispatchPledgeSavedMessage();
    this.onBack();
  }

  private openPersonSearch(): void {
    this.popupOutletService.open(this.modules, 'select-person', this.injector);
  }

  private openPropertySearch(): void {
    this.popupOutletService.open(this.modules, 'select-property', this.injector);
  }
}
