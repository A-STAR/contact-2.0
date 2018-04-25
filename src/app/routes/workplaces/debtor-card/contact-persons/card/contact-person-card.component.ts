import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { first, map, mapTo, mergeMap } from 'rxjs/operators';

import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ContactPersonCardService } from './contact-person-card.service';
import { ContactPersonsService } from '@app/routes/workplaces/core/contact-persons/contact-persons.service';
import { DYNAMIC_MODULES } from '@app/core/dynamic-loader/dynamic-loader.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { invert } from '@app/core/utils';

import { linkFormConfig } from './config/link-form';
import { contactPersonFormConfig } from './config/contact-person-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-contact-person-card',
  templateUrl: 'contact-person-card.component.html',
})
export class ContactPersonCardComponent implements AfterViewInit {
  @ViewChild('linkForm') linkForm: MetadataFormComponent<any>;
  @ViewChild('contactPersonForm') contactPersonForm: MetadataFormComponent<any>;

  readonly paramMap = this.route.snapshot.paramMap;

  /**
   * Contact person link ID in pivot table
   */
  readonly contactId = Number(this.paramMap.get('contactId'));

  /**
   * Debt ID
   */
  readonly debtId = Number(this.paramMap.get('debtId'));

  /**
   * ID of person who is a debtor (displayed in debtor card)
   */
  readonly debtorId = Number(this.paramMap.get('debtorId'));

  /**
   * ID of person who is linked to the debtor as contact person via contactId
   */
  readonly personId = Number(this.paramMap.get('personId'));

  readonly editing = Boolean(this.contactId);

  readonly contactPersonFormConfig = contactPersonFormConfig;
  readonly linkFormConfig = linkFormConfig;

  readonly contactPerson$ = this.contactPersonCardService.contactPerson$;

  readonly isContactPersonFormDisabled$ = this.contactPerson$.pipe(
    map(Boolean),
  );

  readonly edit$ = this.route.data.pipe(
    map(data => data.edit),
  );

  readonly showContractForm$ = this.route.data.pipe(
    map(data => data.showContractForm),
  );

  readonly contactPersonTitlebar: ITitlebar = {
    title: 'routes.workplaces.debtorCard.contactPerson.card.forms.contactPerson.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        action: () => this.openPersonSearch(),
        enabled: this.edit$.pipe(map(invert)),
      },
    ]
  };

  constructor(
    private contactPersonCardService: ContactPersonCardService,
    private contactPersonsService: ContactPersonsService,
    private injector: Injector,
    private personService: PersonService,
    private popupOutletService: PopupOutletService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DYNAMIC_MODULES) private modules: IDynamicModule[][],
  ) {}

  get canSubmit(): boolean {
    const linkFormGroup = this.linkForm
      ? this.linkForm.formGroup
      : null;
    const personFormGroup = this.contactPersonForm
      ? this.contactPersonForm.formGroup
      : null;
    const linkFormValid = linkFormGroup && linkFormGroup.valid;
    const personFormValid = personFormGroup && (personFormGroup.valid || personFormGroup.disabled);
    return linkFormValid && personFormValid;
  }

  ngAfterViewInit(): void {
    if (this.editing) {
      this.contactPersonsService
        .fetch(this.debtorId, this.personId)
        .subscribe(person => {
          const { linkTypeCode, ...rest } = person;
          this.linkForm.formGroup.patchValue({ linkTypeCode });
          this.contactPersonForm.formGroup.patchValue(rest);
        });
    }
  }

  onContactPersonFormClear(): void {
    this.contactPersonCardService.selectContactPerson(null);
    this.contactPersonForm.formGroup.reset();
  }

  onSave(): void {
    this.contactPerson$
      .pipe(
        first(),
        mergeMap(selectedPerson => {
          if (selectedPerson) {
            return of(selectedPerson.id);
          }
          const person = this.contactPersonForm.data;
          return this.editing
            ? this.personService.update(this.personId, person).pipe(mapTo(this.personId))
            : this.personService.create(person);
        }),
      )
      .subscribe(personId => {
        const linkTypeCode = this.linkForm.data.linkTypeCode;
        if (linkTypeCode) {
          if (this.editing) {
            this.contactPersonsService
              .update(this.debtorId, this.personId, { linkTypeCode })
              .subscribe(() => this.onSuccess());
          } else {
            this.contactPersonsService
              .create(this.debtorId, { contactId: personId, linkTypeCode })
              .subscribe(() => this.onSuccess());
          }
        } else {
          this.onSuccess();
        }
      });
  }

  onSuccess(): void {
    this.contactPersonsService.dispatchContactPersonSavedMessage();
    this.onBack();
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }

  private openPersonSearch(): void {
    this.popupOutletService.open(this.modules, 'select-person', this.injector);
  }
}
