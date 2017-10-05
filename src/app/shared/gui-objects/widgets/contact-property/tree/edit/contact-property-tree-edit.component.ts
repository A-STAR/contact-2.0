import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../../core/converter/value-converter.interface';

import { ContactPropertyService } from '../../contact-property.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { makeKey } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.contactProperty.edit');

@Component({
  selector: 'app-contact-property-tree-edit',
  templateUrl: './contact-property-tree-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeEditComponent implements OnInit, OnDestroy {
  @Input() contactType: number;
  @Input() treeType: number;
  @Input() selectedId: number;

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  controls: IDynamicFormItem[];
  data = {};
  attributeTypes = [];

  private _formSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactPropertyService: ContactPropertyService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this._formSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_DEBT_LIST_1,
        UserDictionariesService.DICTIONARY_DEBT_LIST_2,
        UserDictionariesService.DICTIONARY_DEBT_LIST_3,
        UserDictionariesService.DICTIONARY_DEBT_LIST_4,
        UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE,
        UserDictionariesService.DICTIONARY_CONTACT_PROMISE_INPUT_MODE,
      ]),
      this.contactPropertyService.fetchTemplates(4, 0, true),
      this.contactPropertyService.fetchAttributeTypes(),
      this.selectedId
        ? this.contactPropertyService.fetch(this.contactType, this.treeType, this.selectedId)
        : Observable.of(null),
    ).subscribe(([ dictionaries, templates, attributeTypes, data ]) => {
      this.controls = this.buildControls(dictionaries, templates);
      this.attributeTypes = this.convertToNodes(attributeTypes);
      this.data = {
        ...data,
        template: data.templateFormula
          ? { name: 'templateFormula', value: data.templateFormula }
          : { name: 'templateId', value: data.templateId },
        nextCallDays: data.nextCallFormula
          ? { name: 'nextCallFormula', value: data.nextCallFormula }
          : { name: 'nextCallDays', value: data.nextCallDays },
      };
      console.log(attributeTypes);
      console.log(data);
      this.cdRef.markForCheck();
    });
  }

  convertToNodes(attributeTypes: any[]): any[] {
    return attributeTypes
      .map(attribute => {
        const { children, ...data } = attribute;
        return {
          data,
          ...(children && children.length ? { children: this.convertToNodes(children) } : {}),
        };
      })
      .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return true;
  }

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onIsDisplayedChange(value: boolean, node: any, traverseUp: boolean = true, traverseDown: boolean = true): void {
    node.data.isDisplayed = value;
    if (!value && node.data.isMandatory) {
      node.data.isMandatory = false;
    }
    if (traverseUp && node.parent) {
      const isParentDisplayed = node.parent.children.reduce((acc, child) => acc || child.data.isDisplayed, false);
      this.onIsDisplayedChange(isParentDisplayed, node.parent, true, false);
    }
    if (traverseDown && node.children) {
      node.children.forEach(child => this.onIsDisplayedChange(value, child, false, true));
    }
    if (traverseUp && traverseDown) {
      this.cdRef.markForCheck();
    }
  }

  onIsMandatoryChange(value: boolean, node: any): void {
    node.data.isMandatory = value;
    if (value && !node.data.isDisplayed) {
      this.onIsDisplayedChange(true, node);
    }
  }

  private buildControls(
    dictionaries: { [key: number]: IOption[] },
    templates: any[],
  ): IDynamicFormItem[] {
    const debtStatusOptions = dictionaries[UserDictionariesService.DICTIONARY_DEBT_STATUS].filter(option => option.value > 20000);
    const modeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE];
    const promiseModeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_PROMISE_INPUT_MODE];
    const dict1Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_1];
    const dict2Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_2];
    const dict3Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_3];
    const dict4Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_4];

    const templateInputOptions = {
      segmentedInputOptions: [
        { name: 'templateId', label: 'widgets.contactProperty.dialogs.edit.value' },
        { name: 'templateFormula', label: 'widgets.contactProperty.dialogs.edit.formula' },
      ]
    };
    const nextCallInputOptions = {
      segmentedInputOptions: [
        { name: 'nextCallDays', label: 'widgets.contactProperty.dialogs.edit.value' },
        { name: 'nextCallFormula', label: 'widgets.contactProperty.dialogs.edit.formula' },
      ]
    };

    return [
      { label: labelKey('code'), controlName: 'code', type: 'text', width: 3 },
      // TODO(d.maltsev): multi-text
      { label: labelKey('name'), controlName: 'name', type: 'text', required: true, width: 6 },
      // TODO(d.maltsev): color picker
      { label: labelKey('boxColor'), controlName: 'boxColor', type: 'text', width: 3 },
      {
        children: [
          {
            width: 6,
            children: [
              { label: labelKey('commentMode'), controlName: 'commentMode', type: 'select', options: modeOptions },
              // TODO(d.maltsev): options from lookup
              { label: labelKey('autoCommentIds'), controlName: 'autoCommentIds', type: 'select', options: [] },
              { label: labelKey('regInvisible'), controlName: 'regInvisible', type: 'select', options: modeOptions },
              { label: labelKey('nextCallMode'), controlName: 'nextCallMode', type: 'select', options: modeOptions },
              { label: labelKey('promiseMode'), controlName: 'promiseMode', type: 'select', options: promiseModeOptions },
              { label: labelKey('paymentMode'), controlName: 'paymentMode', type: 'select', options: promiseModeOptions },
              { label: labelKey('callReasonMode'), controlName: 'callReasonMode', type: 'select', options: modeOptions },
              { label: labelKey('debtStatusCode'), controlName: 'debtStatusCode', type: 'select', options: debtStatusOptions },
              { label: labelKey('statusReasonMode'), controlName: 'statusReasonMode', type: 'select', options: modeOptions },
              { label: labelKey('debtReasonMode'), controlName: 'debtReasonMode', type: 'select', options: modeOptions },
            ]
          },
          {
            width: 6,
            children: [
              { label: labelKey('template'), controlName: 'template', type: 'segmented', ...templateInputOptions },
              { label: labelKey('nextCallDays'), controlName: 'nextCallDays', type: 'segmented', ...nextCallInputOptions },
              { label: labelKey('dictValue1'), controlName: 'dictValue1', type: 'select', options: dict1Options },
              { label: labelKey('dictValue2'), controlName: 'dictValue2', type: 'select', options: dict2Options },
              { label: labelKey('dictValue3'), controlName: 'dictValue3', type: 'select', options: dict3Options },
              { label: labelKey('dictValue4'), controlName: 'dictValue4', type: 'select', options: dict4Options },
              { label: labelKey('isInvalidContact'), controlName: 'isInvalidContact', type: 'checkbox' },
              { label: labelKey('addPhone'), controlName: 'addPhone', type: 'checkbox' },
              { label: labelKey('isRefusal'), controlName: 'isRefusal', type: 'checkbox' },
              { label: labelKey('isSuccess'), controlName: 'isSuccess', type: 'checkbox' },
              { label: labelKey('changeResponsible'), controlName: 'changeResponsible', type: 'checkbox' },
              { label: labelKey('contactInvisible'), controlName: 'contactInvisible', type: 'checkbox' },
              // TODO(d.maltsev): duplicate name (see http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=121077805)
              // { label: labelKey('regInvisible'), controlName: 'regInvisible', type: 'checkbox' },
            ]
          }
        ]
      },
    ];
  }
}
