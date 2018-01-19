import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';

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
    // TODO(d.maltsev): remove autoComment before sending request to server
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

  // get isPaymentFormHidden$(): Observable<boolean> {
  //   return this.contactRegistrationService.canSetPayment$;
  // }

  // get isPromiseFormHidden$(): Observable<boolean> {
  //   return this.contactRegistrationService.canSetPromise$;
  // }

  get canSubmit(): boolean {
    return true;
  }

  onSubmit(): void {
    //
  }

  onBack(): void {
    this.contactRegistrationService.mode = IContactRegistrationMode.TREE;
    this.cdRef.markForCheck();
  }
}
