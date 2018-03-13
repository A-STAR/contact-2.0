import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DebtService } from '@app/core/debt/debt.service';
import { IncomingCallService } from '../incoming-call.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { addFormLabel } from '@app/core/utils';

@Component({
  selector: 'app-incoming-call-filter',
  templateUrl: 'filter.component.html',
  styleUrls: [ 'filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private static PERSON_ROLE_INITIAL = 1;

  controls: IDynamicFormControl[] = [
    { controlName: 'debtId', type: 'text' },
    { controlName: 'fullName', type: 'text' },
    { controlName: 'contract', type: 'text' },
    { controlName: 'phoneNumber', type: 'text' },
    { controlName: 'fullAddress', type: 'text' },
    { controlName: 'docNumber', type: 'text' },
    { controlName: 'birthDate', type: 'datepicker' },
    // this used to be a 'multiselectwrapper'
    { controlName: 'personRoleCodes', type: 'select', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { controlName: 'isClosedDebt', type: 'checkbox' },
  ].map(addFormLabel('modules.incomingCall.filter.form'));

  private openIncomingCallDataSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private incomingCallService: IncomingCallService,
  ) {}

  ngAfterViewInit(): void {
    this.openIncomingCallDataSub =
      this.debtService.incomingCallSearchParams
        .subscribe(data => {
          if (data && data.debtId) {
            this.patchControl('debtId', data.debtId);
            this.patchControl('personRoleCodes', [FilterComponent.PERSON_ROLE_INITIAL]);
            this.onSearchClick();
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

  private patchControl(name: string, data: any): void {
    const control = this.form.getControl(name);
    if (control) {
      control.patchValue(data);
      control.markAsDirty();
    }
  }
}
