import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl, IDynamicFormSelectControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { AccordionService } from '../../../../shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { OutcomeService } from '../outcome/outcome.service';
import { MiscService } from './misc.service';
import { UserTemplatesService } from '../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, valuesToOptions } from '../../../../core/utils';
import { IOption } from '../../../../core/converter/value-converter.interface';

const labelKey = makeKey('modules.contactRegistration.misc');

@Component({
  selector: 'app-contact-registration-misc',
  templateUrl: './misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiscComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() debtId: number;
  @Input() personId: number;
  @Input() personRole: number;

  controls = [
    { controlName: 'nextCallDateTime', type: 'datepicker', displayTime: true },
    { controlName: 'callReasonCode', type: 'selectwrapper', dictCode: 49 },
    { controlName: 'debtReasonCode', type: 'selectwrapper', dictCode: 11 },
    { controlName: 'refusalReasonCode', type: 'selectwrapper', dictCode: 19, parentCode: 3 },
    { controlName: 'statusReasonCode', type: 'selectwrapper', dictCode: 19 },
    { controlName: 'comment', type: 'textarea' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};

  autoCommentId: number;
  autoCommentOptions: IOption[];
  autoComment: string;

  private autoCommentIdSubscription: Subscription;
  private outcomeSubscription: Subscription;

  constructor(
    private accordionService: AccordionService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private miscService: MiscService,
    private outcomeService: OutcomeService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this.autoCommentIdSubscription = this.contactRegistrationService.autoComment$
      .filter(Boolean)
      .subscribe(({ autoComment, autoCommentId, comment }) => {
        this.autoComment = autoComment;
        this.autoCommentId = autoCommentId;
        if (comment) {
          this.data = { ...this.data, comment };
          this.form.getControl('comment').markAsDirty();
        }
        this.cdRef.markForCheck();
      });

    this.outcomeSubscription = combineLatest(
      this.contactRegistrationService.canAddCallReason$,
      this.contactRegistrationService.canAddComment$,
      this.contactRegistrationService.canAddDebtReason$,
      this.contactRegistrationService.canAddNextCall$,
      this.contactRegistrationService.canAddRefusal$,
      this.contactRegistrationService.canAddStatusChangeReason$,
      this.contactRegistrationService.selectedNode$,
    )
    .subscribe(([
      canAddCallReason,
      canAddComment,
      canAddDebtReason,
      canAddNextCall,
      canAddRefusal,
      canAddStatusChangeReason,
      node,
    ]) => {
      const { nextCallMode, commentMode, debtReasonMode, callReasonMode, statusReasonMode, debtStatusCode } = (node as any).data;
      this.toggleControl('callReasonCode', canAddCallReason, callReasonMode === 3);
      this.toggleControl('comment', canAddComment, commentMode === 3);
      this.toggleControl('debtReasonCode', canAddDebtReason, debtReasonMode === 3);
      this.toggleControl('nextCallDateTime', canAddNextCall, nextCallMode === 3);
      this.toggleControl('refusalReasonCode', canAddRefusal, true);
      this.toggleControl('statusReasonCode', canAddStatusChangeReason, statusReasonMode === 3);
      (<IDynamicFormSelectControl>this.getControl('statusReasonCode')).parentCode = debtStatusCode;
    });

    this.userTemplatesService.getTemplates(4, 0)
      .map(valuesToOptions)
      .subscribe(autoCommentOptions => {
        this.autoCommentOptions = autoCommentOptions;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.autoCommentIdSubscription.unsubscribe();
    this.outcomeSubscription.unsubscribe();
  }

  get canAddAutoComment$(): Observable<boolean> {
    return this.contactRegistrationService.canAddAutoComment$;
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    const data = {
      ...this.form.serializedUpdates,
      ...(this.autoCommentId && this.autoCommentId[0] ? { autoCommentId: this.autoCommentId[0].value } : {}),
    };
    this.miscService.create(this.debtId, guid, data)
      .subscribe(() => {
        this.accordionService.next();
        this.cdRef.markForCheck();
      });
  }

  onAutoCommentIdChange(option: IOption[]): void {
    const templateId = Number(option[0].value);
    if (templateId) {
      this.outcomeService
        .fetchAutoComment(this.debtId, this.personId, this.personRole, templateId)
        .catch(() => of(null))
        .subscribe(autoComment => {
          this.autoComment = autoComment;
          this.cdRef.markForCheck();
        });
    }
  }

  private toggleControl(name: string, display: boolean, required: boolean = false): void {
    const control = this.getControl(name);
    control.display = display;
    control.required = display && required;
    if (!display) {
      this.data = {
        ...this.data,
        [name]: null,
      };
    }
    this.cdRef.markForCheck();
  }

  private getControl(name: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === name);
  }
}
