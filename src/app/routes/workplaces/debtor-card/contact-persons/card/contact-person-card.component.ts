import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { first, map, mapTo, mergeMap } from 'rxjs/operators';

import { ContactPersonCardService } from './contact-person-card.service';
import { ContactPersonsService } from '@app/routes/workplaces/core/contact-persons/contact-persons.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { contactPersonFormConfig } from './config/contact-person-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-contact-person-card',
  templateUrl: 'contact-person-card.component.html',
})
export class ContactPersonCardComponent implements OnInit {
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

  constructor(
    private contactPersonCardService: ContactPersonCardService,
    private contactPersonsService: ContactPersonsService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.editing) {
      this.contactPersonsService
        .fetch(this.debtorId, this.contactId)
        .subscribe(person => this.contactPersonForm.formGroup.patchValue(person));
    }
  }

  onContactPersonFormClear(): void {
    this.contactPersonCardService.selectContactPerson(null);
    this.contactPersonForm.formGroup.reset();
  }

  onSave(): void {
    const { linkTypeCode, ...person } = this.contactPersonForm.data;
    this.contactPerson$
      .pipe(
        first(),
        mergeMap(selectedPerson => {
          if (selectedPerson) {
            return of(selectedPerson.id);
          }
          return this.editing
            ? this.personService.update(this.personId, person).pipe(mapTo(this.personId))
            : this.personService.create(person);
        }),
      )
      .subscribe(personId => {
        if (linkTypeCode) {
          if (this.editing) {
            this.contactPersonsService
              .update(this.debtorId, this.contactId, { linkTypeCode })
              .subscribe(() => this.onBack());
          } else {
            this.contactPersonsService
              .create(this.debtorId, { contactId: personId, linkTypeCode })
              .subscribe(() => this.onBack());
          }
        } else {
          this.onBack();
        }
      });
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }
}