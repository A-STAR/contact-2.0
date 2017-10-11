import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { IDynamicFormControl, IDynamicFormItem } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactRegistrationService } from '../contact-registration.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../core/utils';

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
      title: 'Регистрация обещания',
      children: [
        { controlName: 'promise.date', type: 'datepicker' },
        { controlName: 'promise.amount', type: 'number' },
        { controlName: 'promise.isUnconfirmed', type: 'boolean' },
        { controlName: 'promise.percentage', type: 'number' },
      ]
    },
    {
      title: 'Регистрация неподтвержденного платежа',
      children: [
        { controlName: 'payment.date', type: 'datepicker' },
        { controlName: 'payment.amount', type: 'number' },
        { controlName: 'payment.percentage', type: 'number' },
        { controlName: 'payment.currencyId', type: 'selectwrapper', lookupKey: 'currencies' },
      ]
    },
    {
      title: 'Ввод даты повторного звонка',
      children: [
        { controlName: 'nextCallDateTime', type: 'datepicker' },
      ]
    },
    {
      title: 'Ввод комментария',
      children: [
        { controlName: 'comment', type: 'textarea' },
      ]
    },
    {
      title: 'Ввод автокомментария',
      children: [
        { controlName: 'autoCommentId', type: 'select', options: [] },
        { controlName: 'autoComment', type: 'autoComment', disabled: true },
      ]
    },
    {
      title: 'Ввод нового номера должника',
      children: [
        { controlName: 'phone.typeCode', type: 'selectwrapper', dictCode: 17 },
        { controlName: 'phone.phoneNumber', type: 'text' },
        { controlName: 'phone.stopAutoSms', type: 'checkbox' },
        { controlName: 'phone.stopAutoInfo', type: 'checkbox' },
        { controlName: 'phone.comment', type: 'textarea' },
      ]
    },
    {
      title: 'Ввод причины возникновения задолженности',
      children: [
        { controlName: 'debtReasonCode', type: 'selectwrapper', dictCode: 11 },
      ]
    },
    {
      title: 'Регистрация отказа от оплаты',
      children: [
        { controlName: 'refusalReasonCode', type: 'selectwrapper', dictCode: 19 },
      ]
    },
    {
      title: 'Прикрепление файла',
      children: [
        { controlName: 'fileAttach.docTypeCode', type: 'selectwrapper', dictCode: 33 },
        { controlName: 'fileAttach.docName', type: 'text' },
        { controlName: 'fileAttach.docNumber', type: 'text' },
        { controlName: 'fileAttach.comment', type: 'textarea' },
        { controlName: 'fileAttach.file', type: 'file' },
      ]
    },
    {
      title: 'Ввод причины звонка',
      children: [
        { controlName: 'callReasonCode', type: 'selectwrapper', dictCode: 49 },
      ]
    },
    {
      title: 'Ввод причины смены статуса на пользовательский',
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

  attributes: any[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {
    // this.contactRegistrationService.selectedNode$.subscribe(console.log);
  }

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
}
