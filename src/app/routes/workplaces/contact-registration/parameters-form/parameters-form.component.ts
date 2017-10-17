import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { IDynamicFormControl, IDynamicFormItem } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { ContactRegistrationService } from '../contact-registration.service';

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

  controls: IDynamicFormItem[] = [
    {
      title: labelKey('promise.title'),
      children: [
        { controlName: 'promise.date', type: 'datepicker' },
        { controlName: 'promise.amount', type: 'number' },
        { controlName: 'promise.isUnconfirmed', type: 'boolean' },
        { controlName: 'promise.percentage', type: 'number' },
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

  data = {};

  attributes: ITreeNode[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
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
}
