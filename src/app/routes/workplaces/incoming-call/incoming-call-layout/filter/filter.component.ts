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
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, filter, throttleTime, tap, distinctUntilChanged } from 'rxjs/operators';

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

  private subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private callService: CallService,
    private incomingCallService: IncomingCallService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const callSubscription = combineLatest(
      this.route.queryParams,
      this.callService.pbxState$,
    )
    .pipe(
      filter(([ params, state ]) =>
        state && state.payload && params.phoneNumber && params.phoneNumber === state.payload.phoneNumber
      ),
      map(([ _, state ]) => state)
    )
    .subscribe(state => {
      this.incomingCallService.searchParams = { phoneNumber: state.payload.phoneNumber };
      this.cdRef.markForCheck();
    });

    this.subscription.add(callSubscription);
  }

  ngAfterViewInit(): void {
    const paramsSubscription = this.route.queryParams
      .pipe(
        map(params => params.debtId),
        distinctUntilChanged()
      )
      .subscribe(debtId => {
        this.patchControl('debtId', debtId || '');
        this.patchControl('personRoleCodes', [FilterComponent.PERSON_ROLE_INITIAL]);
        this.onSearchClick();
        this.addEnterPressListener();
      });
    this.subscription.add(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  private addEnterPressListener(): void {
    const subscription = fromEvent(document, 'keyup')
      .pipe(
        filter((event: KeyboardEvent) => event.keyCode === 13),
        throttleTime(300),
        tap(() => this.incomingCallService.searchParams = null),
        tap(this.onSearchClick.bind(this)),
      )
      .subscribe();

    this.subscription.add(subscription);
  }
}
