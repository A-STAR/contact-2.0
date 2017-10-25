import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { DebtService } from '../../../../shared/gui-objects/widgets/debt/debt/debt.service';
import { OutcomeService } from '../outcome/outcome.service';
import { MiscService } from './misc.service';
import { UserTemplatesService } from '../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, valuesToOptions } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.misc');

@Component({
  selector: 'app-contact-registration-misc',
  templateUrl: './misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiscComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() debtId: number;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls = [
    { controlName: 'nextCallDateTime', type: 'datepicker', displayTime: true },
    { controlName: 'autoCommentId', type: 'select', options: [] },
    { controlName: 'autoComment', type: 'textarea', disabled: true },
    { controlName: 'callReasonCode', type: 'selectwrapper', dictCode: 49 },
    { controlName: 'debtReasonCode', type: 'selectwrapper', dictCode: 11 },
    { controlName: 'refusalReasonCode', type: 'selectwrapper', dictCode: 19 },
    { controlName: 'statusReasonCode', type: 'selectwrapper', dictCode: 19 },
    { controlName: 'comment', type: 'textarea' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};

  private autoCommentIdSubscription: Subscription;
  private outcomeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private debtService: DebtService,
    private miscService: MiscService,
    private outcomeService: OutcomeService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this.outcomeSubscription = Observable.combineLatest(
      this.contactRegistrationService.canAddAutoComment$,
      this.contactRegistrationService.canAddCallReason$,
      this.contactRegistrationService.canAddComment$,
      this.contactRegistrationService.canAddDebtReason$,
      this.contactRegistrationService.canAddNextCall$,
      this.contactRegistrationService.canAddRefusal$,
      this.contactRegistrationService.canAddStatusChangeReason$,
    )
    .subscribe(([
      canAddAutoComment,
      canAddCallReason,
      canAddComment,
      canAddDebtReason,
      canAddNextCall,
      canAddRefusal,
      canAddStatusChangeReason,
    ]) => {
      this.toggleControl('autoCommentId', canAddAutoComment);
      this.toggleControl('autoComment', canAddAutoComment);
      this.toggleControl('callReasonCode', canAddCallReason);
      this.toggleControl('comment', canAddComment);
      this.toggleControl('debtReasonCode', canAddDebtReason);
      this.toggleControl('nextCallDateTime', canAddNextCall);
      this.toggleControl('refusalReasonCode', canAddRefusal);
      this.toggleControl('statusReasonCode', canAddStatusChangeReason);
    });

    this.userTemplatesService.getTemplates(4, 0)
      .map(valuesToOptions)
      .subscribe(autoCommentOptions => {
        this.getControl('autoCommentId').options = autoCommentOptions;
        this.cdRef.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this.autoCommentIdSubscription = this.form.onCtrlValueChange('autoCommentId')
      .filter(Boolean)
      .flatMap(value => {
        return this.getPersonId()
          .flatMap(personId => {
            const templateId = Array.isArray(value) ? value[0].value : value;
            return this.outcomeService
              .fetchAutoComment(this.debtId, personId, 1, templateId)
              .catch(() => Observable.of(null));
          });
      })
      .subscribe(autoComment => this.updateData('autoComment', autoComment));
  }

  ngOnDestroy(): void {
    this.autoCommentIdSubscription.unsubscribe();
    this.outcomeSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    const { autoComment, ...data } = this.form.getSerializedUpdates();
    this.miscService.create(this.debtId, guid, data)
      .subscribe(() => {
        this.contactRegistrationService.nextStep();
        this.cdRef.markForCheck();
      });
  }

  private toggleControl(name: string, display: boolean): void {
    this.getControl(name).display = display;
    if (!display) {
      this.updateData(name, null);
    }
    this.cdRef.markForCheck();
  }

  private getControl(name: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === name);
  }

  private updateData(key: string, value: any): void {
    this.data = {
      ...this.data,
      [key]: value,
    };
    this.cdRef.markForCheck();
  }

  private getPersonId(): Observable<number> {
    return this.debtService.fetch(null, this.debtId)
      .publishReplay(1)
      .refCount()
      .map(debt => debt.personId)
      .distinctUntilChanged();
  }
}
