import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, filter, map } from 'rxjs/operators';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { CallService } from '@app/core/calls/call.service';
import { IncomingCallService } from '../../incoming-call.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { addFormLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-incoming-call-filter',
  styleUrls: [ 'filter.component.scss' ],
  templateUrl: 'filter.component.html',
})
export class FilterComponent implements OnInit, AfterViewInit, OnDestroy {
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
    { controlName: 'personRoleCodes', type: 'multiselect', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { controlName: 'isClosedDebt', type: 'checkbox' },
  ].map(addFormLabel('modules.incomingCall.filter.form'));

  private openIncomingCallDataSub: Subscription;
  private incommingSearchSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private callService: CallService,
    private incomingCallService: IncomingCallService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.incommingSearchSub = combineLatest(
      this.route.queryParams,
      this.callService.pbxState$.filter(state => state && !!state.payload),
    )
    .pipe(
      first(),
      filter(([ params, state ]) => !!params.phoneNumber && params.phoneNumber === state.payload.phoneNumber),
      map(([ _, state ]) => state)
    )
    .subscribe(state => {
      this.incomingCallService.searchParams = { phoneNumber: state.payload.phoneNumber };
      this.cdRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    const debtId = Number(this.route.snapshot.paramMap.get('debtId'));
    if (debtId) {
      this.patchControl('debtId', debtId);
      this.patchControl('personRoleCodes', [FilterComponent.PERSON_ROLE_INITIAL]);
      this.onSearchClick();
    }
  }

  ngOnDestroy(): void {
    this.incommingSearchSub.unsubscribe();
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
