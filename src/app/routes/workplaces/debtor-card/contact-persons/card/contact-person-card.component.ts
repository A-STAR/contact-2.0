import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators/map';

import { ContactPersonCardService } from './contact-person-card.service';
import { ContactPersonsService } from '@app/routes/workplaces/core/contact-persons/contact-persons.service';

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
  readonly debtId = Number(this.paramMap.get('debtId'));
  readonly debtorId = Number(this.paramMap.get('debtorId'));
  readonly contactId = Number(this.paramMap.get('contactId'));

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
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.contactPersonsService
      .fetch(this.debtorId, this.contactId)
      .subscribe(person => this.contactPersonForm.formGroup.patchValue(person));
  }

  onContactPersonFormClear(): void {
    this.contactPersonCardService.selectContactPerson(null);
    this.contactPersonForm.formGroup.reset();
  }

  onSave(): void {
    // if (this.contactId) {
    //   this.contactPersonsService
    //     .update(null, null, null)
    //     .subscribe(() => this.onBack());
    // } else {
    //   this.contactPersonsService
    //     .create(null, null)
    //     .subscribe(() => this.onBack());
    // }
    this.onBack();
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtId');
    if (debtId && debtorId) {
      this.router.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }
}
