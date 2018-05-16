import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { first, map, mapTo, mergeMap } from 'rxjs/operators';
import { isEmpty } from 'ramda';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';
import { IEmployment } from '@app/routes/workplaces/core/guarantee/guarantee.interface';
import { IIdentityDoc } from '@app/routes/workplaces/core/identity/identity.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DYNAMIC_MODULES } from '@app/core/dynamic-loader/dynamic-loader.service';
import { GuaranteeCardService } from './guarantee-card.service';
import { GuaranteeService } from '@app/routes/workplaces/core/guarantee/guarantee.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { contractFormConfig } from './config/contract-form-config';
import { guarantorFormConfig } from './config/guarantor-form-config';

import { invert } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-guarantee-card',
  templateUrl: 'guarantee-card.component.html',
})
export class GuarantorCardComponent implements AfterViewInit {
  @ViewChild('contractForm') contractForm: MetadataFormComponent<any>;
  @ViewChild('guarantorForm') guarantorForm: MetadataFormComponent<any>;

  readonly contractFormConfig = contractFormConfig;
  readonly guarantorFormConfig = guarantorFormConfig;

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contract ID (link between debtor and guarantor)
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
   * ID of person who is linked to the debtor as guarantor via contractId
   */
  readonly guarantorId = Number(this.paramMap.get('guarantorId'));

  /**
   * Guarantor role (according to dictionary 44)
   */
  readonly guarantorRole = 2;

  readonly phoneContactType = 1;

  readonly editing = Boolean(this.guarantorId);

  readonly guarantor$ = this.guaranteeCardService.guarantor$;

  readonly isGuarantorFormDisabled$ = this.guarantor$.pipe(
    map(Boolean),
  );

  readonly edit$ = this.route.data.pipe(
    map(data => data.edit),
  );

  readonly showContractForm$ = this.route.data.pipe(
    map(data => data.showContractForm),
  );

  readonly contractTitlebar: ITitlebar = {
    title: 'routes.workplaces.debtorCard.guarantee.card.forms.contract.title',
  };

  readonly guarantorTitlebar: ITitlebar = {
    title: 'routes.workplaces.debtorCard.guarantee.card.forms.guarantor.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPersonSearch(),
        enabled: this.edit$.pipe(map(invert)),
      },
    ]
  };

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private guaranteeCardService: GuaranteeCardService,
    private guaranteeService: GuaranteeService,
    private injector: Injector,
    private personService: PersonService,
    private popupOutletService: PopupOutletService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DYNAMIC_MODULES) private modules: IDynamicModule[][],
  ) {}

  get canSubmit(): boolean {
    const contractFormGroup = this.contractForm
      ? this.contractForm.formGroup
      : null;
    const guarantorFormGroup = this.guarantorForm
      ? this.guarantorForm.formGroup
      : null;
    const contractFormValid = !contractFormGroup || contractFormGroup.valid;
    const guarantorFormValid = guarantorFormGroup && (guarantorFormGroup.valid || guarantorFormGroup.disabled);
    return contractFormValid && guarantorFormValid;
  }

  ngAfterViewInit(): void {
    if (this.editing) {
      this.guaranteeService
        .fetch(this.debtId, this.contractId)
        .subscribe(response => {
          const { personIds, ...contract } = response;
          this.contractForm.formGroup.patchValue(contract);
        });
      this.personService
        .fetch(this.guarantorId)
        .subscribe(guarantor => {
          this.guarantorForm.formGroup.patchValue(guarantor);
        });
    }
  }

  onGuarantorFormClear(): void {
    this.guaranteeCardService.selectGuarantor(null);
    this.guarantorForm.formGroup.reset();
  }

  onSave(): void {
    this.guarantor$
      .pipe(
        first(),
        mergeMap(selectedGuarantor => {
          return selectedGuarantor
            ? of (selectedGuarantor.id)
            : this.saveGuarantor();
        }),
        mergeMap(guarantorId => this.saveContract(guarantorId))
      ).subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.guaranteeService.dispatchGuarantorSavedMessage();
    this.onBack();
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

  onPhoneRegister(phone: IPhone): void {
    this.contactRegistrationService.startRegistration({
      contactId: phone.id,
      contactType: this.phoneContactType,
      debtId: this.debtId,
      personId: this.guarantorId,
      personRole: this.guarantorRole,
    });
  }

  onAddressAdd(): void {
    this.router.navigate([ 'address/create' ], { relativeTo: this.route });
  }

  onAddressEdit(address: IAddress): void {
    this.router.navigate([ `address/${address.id}` ], { relativeTo: this.route });
  }

  onAddressRegister(address: IAddress): void {
    this.contactRegistrationService.startRegistration({
      contactId: address.id,
      contactType: 3,
      debtId: this.debtId,
      personId: this.guarantorId,
      personRole: this.guarantorRole,
    });
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

  private saveContract(guarantorId: number): Observable<void> {
    if (!this.contractForm) {
      return this.guaranteeService.addGuarantor(this.debtId, this.contractId, guarantorId);
    }
    const { data } = this.contractForm;
    if (isEmpty(data)) {
      return of(null);
    }
    return this.contractId
      ? this.guaranteeService.update(this.debtId, this.contractId, data)
      : this.guaranteeService.create(this.debtId, { ...data, personId: guarantorId });
  }

  private saveGuarantor(): Observable<number> {
    const { data } = this.guarantorForm;
    if (isEmpty(data)) {
      return of(null);
    }
    return this.guarantorId
      ? this.personService.update(this.guarantorId, data).pipe(mapTo(this.guarantorId))
      : this.personService.create(data);
  }

  private openPersonSearch(): void {
    this.popupOutletService.open(this.modules, 'select-person', this.injector);
  }
}
