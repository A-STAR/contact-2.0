import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDebt } from '../../../../shared/gui-objects/widgets/debt/debt/debt.interface';
import { IPromiseLimit } from '../../../../shared/gui-objects/widgets/promise/promise.interface';
import { IDynamicFormControl, IDynamicFormItem } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { DebtService } from '../../../../shared/gui-objects/widgets/debt/debt/debt.service';
import { PromiseService } from '../../../../shared/gui-objects/widgets/promise/promise.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../core/utils';
import { getRawValue, getValue } from '../../../../core/utils/value';

const labelKey = makeKey('modules.contactRegistration.parametersForm')

@Component({
  selector: 'app-parameters-form',
  templateUrl: './parameters-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersFormComponent implements OnInit {
  @Input() debtId: number;
  @Input() contactTypeCode: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  attributes: ITreeNode[];
  controls: IDynamicFormItem[];
  data = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private contactRegistrationService: ContactRegistrationService,
    private promiseService: PromiseService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.debtService.fetch(null, this.debtId),
      this.promiseService.getPromiseLimit(this.debtId),
    )
    .subscribe(([ debt, limit ]) => {
      console.log(debt);
      console.log(limit);
      this.controls = this.buildControls(debt, limit);
    });

    this.contactRegistrationService.selectedNode$
      .filter(Boolean)
      .map(node => node.id)
      .flatMap(nodeId => this.contactRegistrationService.fetchAttributes(this.debtId, this.contactTypeCode, nodeId))
      .subscribe(attributes => {
        this.attributes = attributes;
        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const data = {
      ...this.form.getSerializedUpdates(),
      attributes: this.attributes.map(row => ({
        ...getValue(row.data.typeCode, getRawValue(row.data)),
        code: row.data.code
      })),
    }
    console.log(data);
  }

  private get selectedContact(): any {
    return this.contactRegistrationService.selectedNode$.value.data;
  }

  private getControl(index: number, name: string): IDynamicFormControl {
    return (this.controls[index].children as IDynamicFormControl[]).find(item => item.controlName === name);
  }

  private buildControls(debt: IDebt, limit: IPromiseLimit): IDynamicFormItem[] {
    const { promiseMode } = this.selectedContact;
    return [
      {
        // TODO(d.maltsev): uncomment
        // display: [2, 3].includes(promiseMode),
        title: labelKey('promise.title'),
        children: [
          { controlName: 'promise.date', type: 'datepicker', minDate: new Date() },
          { controlName: 'promise.amount', type: 'number', disabled: promiseMode === 3 },
          { controlName: 'promise.percentage', type: 'number', disabled: promiseMode === 3 },
        ]
      },
      {
        title: labelKey('payment.title'),
        children: [
          { controlName: 'payment.date', type: 'datepicker' },
          { controlName: 'payment.amount', type: 'number' },
          { controlName: 'payment.percentage', type: 'number' },
          { controlName: 'payment.currencyId', type: 'selectwrapper', lookupKey: 'currencies' },
        ]
      },
      {
        title: labelKey('nextCallDateTimeTitle'),
        children: [
          { controlName: 'nextCallDateTime', type: 'datepicker' },
        ]
      },
      {
        title: labelKey('commentTitle'),
        children: [
          { controlName: 'comment', type: 'textarea' },
        ]
      },
      {
        title: labelKey('autoCommentTitle'),
        children: [
          { controlName: 'autoCommentId', type: 'select', options: [] },
          { controlName: 'autoComment', type: 'textarea', disabled: true },
        ]
      },
      {
        title: labelKey('phone.title'),
        children: [
          { controlName: 'phone.typeCode', type: 'selectwrapper', dictCode: 17 },
          { controlName: 'phone.phoneNumber', type: 'text' },
          { controlName: 'phone.stopAutoSms', type: 'checkbox' },
          { controlName: 'phone.stopAutoInfo', type: 'checkbox' },
          { controlName: 'phone.comment', type: 'textarea' },
        ]
      },
      {
        title: labelKey('debtReasonCodeTitle'),
        children: [
          { controlName: 'debtReasonCode', type: 'selectwrapper', dictCode: 11 },
        ]
      },
      {
        title: labelKey('refusalReasonCodeTitle'),
        children: [
          { controlName: 'refusalReasonCode', type: 'selectwrapper', dictCode: 19 },
        ]
      },
      {
        title: labelKey('fileAttach.title'),
        children: [
          { controlName: 'fileAttach.docTypeCode', type: 'selectwrapper', dictCode: 33 },
          { controlName: 'fileAttach.docName', type: 'text' },
          { controlName: 'fileAttach.docNumber', type: 'text' },
          { controlName: 'fileAttach.comment', type: 'textarea' },
          { controlName: 'fileAttach.file', type: 'file' },
        ]
      },
      {
        title: labelKey('callReasonCodeTitle'),
        children: [
          { controlName: 'callReasonCode', type: 'selectwrapper', dictCode: 49 },
        ]
      },
      {
        title: labelKey('statusReasonCodeTitle'),
        children: [
          { controlName: 'statusReasonCode', type: 'selectwrapper', dictCode: 19 },
        ]
      },
    ]
    .map(group => ({
      ...group,
      children: (group.children as IDynamicFormControl[]).map(child => ({
        ...child,
        label: labelKey(child.controlName)
      }))
    }));
  }
}
