import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IContactRegistrationMode } from '../contact-registration.interface';

import { ContactRegistrationService } from '../contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private formBuilder: FormBuilder,
  ) {}

  form = this.formBuilder.group({
    promise: this.formBuilder.group({
      date: null,
      amount: null,
    }),
    payment: this.formBuilder.group({
      date: null,
      amount: null,
      currencyId: null,
    }),
    nextCallDateTime: null,
    comment: '',
    autoComment: '',
    autoCommentId: null,
    phone: this.formBuilder.group({
      typeCode: null,
      phone: null,
      stopAutoSms: false,
      stopAutoInfo: false,
      comment: '',
    }),
    debtReasonCode: null,
    refusalReasonCode: null,
    callReasonCode: null,
    statusReasonCode: null,
  });

  get displayPromiseForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPromise$;
  }

  get displayPaymentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPayment$;
  }

  get displayNextCallDateForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetNextCallDate$;
  }

  get displayCommentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetComment$;
  }

  get displayAutoCommentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetAutoCommentId$;
  }

  get displayPhoneForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPhone$;
  }

  get displayContactPersonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetContactPerson$;
  }

  get displayDebtReasonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetDebtReason$;
  }

  get displayRefusalForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetRefusal$;
  }

  get displayAttachmentForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetAttachment$;
  }

  get displayCallReasonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetCallReason$;
  }

  get displayChangeReasonForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetChangeReason$;
  }

  get debtId$(): Observable<number> {
    return this.contactRegistrationService.debtId$;
  }

  get personId$(): Observable<number> {
    return this.contactRegistrationService.personId$;
  }

  get contactType$(): Observable<number> {
    return this.contactRegistrationService.contactType$;
  }

  get canSubmit(): boolean {
    return this.form.valid;
  }

  onSubmit(): void {
    const { autoComment, ...data } = this.form.value;
    this.contactRegistrationService
      .completeRegistration(data)
      .subscribe(() => this.displayOutcomeTree());
  }

  onBack(): void {
    this.displayOutcomeTree();
  }

  private displayOutcomeTree(): void {
    this.contactRegistrationService.mode = IContactRegistrationMode.TREE;
    this.cdRef.markForCheck();
  }
}
