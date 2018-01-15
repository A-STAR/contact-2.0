import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import {
  DebtOpenIncomingCallService
} from '../../../../shared/gui-objects/widgets/debt-open-incoming-call/debt-open-incoming-call.service';
import { IncomingCallService } from '../incoming-call.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { addFormLabel } from '../../../../core/utils';

@Component({
  selector: 'app-incoming-call-filter',
  templateUrl: 'filter.component.html',
  styleUrls: [ 'filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { controlName: 'debtId', type: 'text' },
    { controlName: 'fullName', type: 'text' },
    { controlName: 'contract', type: 'text' },
    { controlName: 'phoneNumber', type: 'text' },
    { controlName: 'fullAddress', type: 'text' },
    { controlName: 'docNumber', type: 'text' },
    { controlName: 'birthDate', type: 'datepicker' },
    { controlName: 'personRoleCodes', type: 'multiselectwrapper', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { controlName: 'isClosedDebt', type: 'checkbox' },
  ].map(addFormLabel('modules.incomingCall.filter.form'));

  private openIncomingCallDataSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private openIncomingCallService: DebtOpenIncomingCallService,
    private incomingCallService: IncomingCallService,
  ) {}

  ngOnInit(): void {
    this.openIncomingCallDataSub =
      this.openIncomingCallService.data$
        .subscribe(data => {
          if (data) {
            this.incomingCallService.searchParams = data;
            // this.form.form.patchValue({ debtId: data.debtId });
          }
        });
  }

  ngOnDestroy(): void {
    if (this.openIncomingCallDataSub) {
      this.openIncomingCallDataSub.unsubscribe();
    }
  }

  onSearchClick(): void {
    this.incomingCallService.searchParams = this.form.serializedUpdates;
  }

  onClearClick(): void {
    this.incomingCallService.searchParams = null;
    this.form.reset();
    this.form.markAsPristine();
    this.cdRef.markForCheck();
  }
}
