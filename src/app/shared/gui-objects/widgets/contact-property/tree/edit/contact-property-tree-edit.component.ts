import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IContactTreeAttribute } from '../../contact-property.interface';
import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../../core/entity/attributes/entity-attributes.interface';
import { ILookupAttributeType } from '../../../../../../core/lookup/lookup.interface';
import { IOption } from '../../../../../../core/converter/value-converter.interface';
import { ITreeNode } from '../../../../../components/flowtree/treenode/treenode.interface';

import { ContactPropertyService } from '../../contact-property.service';
import { EntityAttributesService } from '../../../../../../core/entity/attributes/entity-attributes.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { flatten, makeKey } from '../../../../../../core/utils';

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

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  data = {};
  attributeTypes: ITreeNode[] = [];

  private _formSubscription: Subscription;
  private _attributeTypesChanged = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactPropertyService: ContactPropertyService,
    private entityAttributesService: EntityAttributesService,
    private lookupService: LookupService,
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
      this.entityAttributesService.getAttributes([
        EntityAttributesService.DICT_VALUE_1,
        EntityAttributesService.DICT_VALUE_2,
        EntityAttributesService.DICT_VALUE_3,
        EntityAttributesService.DICT_VALUE_4,
      ]),
      this.contactPropertyService.fetchTemplates(4, 0, true),
      this.lookupService.attributeTypes,
      this.selectedId
        ? this.contactPropertyService.fetch(this.contactType, this.treeType, this.selectedId)
        : Observable.of(null),
    ).subscribe(([ dictionaries, attributes, templates, attributeTypes, data ]) => {
      this.controls = this.buildControls(dictionaries, templates, attributes);
      this.attributeTypes = this.convertToNodes(attributeTypes, data ? data.attributes : []);
      this.data = {
        ...data,
        template: data && data.templateFormula
          ? { name: 'templateFormula', value: data && data.templateFormula }
          : { name: 'templateId', value: data && data.templateId },
        nextCallDays: data && data.nextCallFormula
          ? { name: 'nextCallFormula', value: data && data.nextCallFormula }
          : { name: 'nextCallDays', value: data && data.nextCallDays },
      };
      // console.log(this.attributeTypes);
      this.cdRef.markForCheck();
    });
  }

  convertToNodes(attributeTypes: ILookupAttributeType[], attributeData: IContactTreeAttribute[]): ITreeNode[] {
    return attributeTypes
      .map(attribute => {
        const { children, ...data } = attribute;
        const hasChildren = children && children.length > 0;
        const attributeDataItem = attributeData ? attributeData.find(item => item.code === attribute.code) : null;
        return {
          data: {
            ...data,
            isMandatory: !!attributeDataItem && !!attributeDataItem.mandatory,
            isDisplayed: !!attributeDataItem,
          },
          ...(hasChildren ? { children: this.convertToNodes(children, attributeDataItem && attributeDataItem.children) } : {}),
          expanded: hasChildren,
        };
      })
      .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.form.valid && (this.form.form.dirty || this._attributeTypesChanged);
  }

  onSubmit(): void {
    const { template, nextCallDays, ...formData } = this.form.getSerializedUpdates();
    const attribute = flatten(this.attributeTypes, 'data')
      .filter(attr => attr.isDisplayed)
      .map(attr => ({ code: attr.code, mandatory: attr.isMandatory }))
    const data = {
      ...formData,
      ...(template ? { [template.name]: template.value } : {}),
      ...(nextCallDays ? { [nextCallDays.name]: nextCallDays.value } : {}),
      attribute,
    };
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onIsDisplayedChange(value: boolean, node: ITreeNode, traverseUp: boolean = true, traverseDown: boolean = true): void {
    this._attributeTypesChanged = true;
    node.data.isDisplayed = value;
    if (!value && node.data.isMandatory) {
      node.data.isMandatory = false;
    }
    if (traverseUp && !!node.parent) {
      const isParentDisplayed = node.parent.children.reduce((acc, child) => acc || !!child.data.isDisplayed, false);
      this.onIsDisplayedChange(isParentDisplayed, node.parent, true, false);
    }
    if (traverseDown && !!node.children) {
      node.children.forEach(child => this.onIsDisplayedChange(value, child, false, true));
    }
    if (traverseUp && traverseDown) {
      this.cdRef.markForCheck();
    }
  }

  onIsMandatoryChange(value: boolean, node: ITreeNode): void {
    this._attributeTypesChanged = true;
    node.data.isMandatory = value;
    if (value && !node.data.isDisplayed) {
      this.onIsDisplayedChange(true, node);
    }
  }

  private buildControls(
    dictionaries: { [key: number]: IOption[] },
    // TODO(d.maltsev): type when the API is ready
    templates: any[],
    attributes: IEntityAttributes,
  ): IDynamicFormItem[] {
    const debtStatusOptions = dictionaries[UserDictionariesService.DICTIONARY_DEBT_STATUS].filter(option => option.value > 20000);
    const modeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE];
    const promiseModeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_PROMISE_INPUT_MODE];
    const dict1Attributes = attributes[EntityAttributesService.DICT_VALUE_1];
    const dict2Attributes = attributes[EntityAttributesService.DICT_VALUE_2];
    const dict3Attributes = attributes[EntityAttributesService.DICT_VALUE_3];
    const dict4Attributes = attributes[EntityAttributesService.DICT_VALUE_4];
    const dict1 = {
      options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_1],
      required: dict1Attributes.isMandatory,
    }
    const dict2 = {
      options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_2],
      required: dict2Attributes.isMandatory,
    }
    const dict3 = {
      options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_3],
      required: dict3Attributes.isMandatory,
    }
    const dict4 = {
      options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_4],
      required: dict4Attributes.isMandatory,
    }

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
      { label: labelKey('code'), controlName: 'code', type: 'text', width: 3, disabled: !!this.selectedId },
      // TODO(d.maltsev): multi-text
      { label: labelKey('name'), controlName: 'name', type: 'text', required: true, width: 6 },
      { label: labelKey('boxColor'), controlName: 'boxColor', type: 'colorpicker', width: 3 },
      {
        children: [
          {
            width: 6,
            children: [
              { label: labelKey('commentMode'), controlName: 'commentMode', type: 'select', options: modeOptions },
              // TODO(d.maltsev): options from lookup (templates)
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
              ...(dict1Attributes.isUsed
                ? [{ label: labelKey('dictValue1'), controlName: 'dictValue1', type: 'select', ...dict1 }]
                : []
              ),
              ...(dict2Attributes.isUsed
                ? [{ label: labelKey('dictValue2'), controlName: 'dictValue2', type: 'select', ...dict2 }]
                : []
              ),
              ...(dict3Attributes.isUsed
                ? [{ label: labelKey('dictValue3'), controlName: 'dictValue3', type: 'select', ...dict3 }]
                : []
              ),
              ...(dict4Attributes.isUsed
                ? [{ label: labelKey('dictValue4'), controlName: 'dictValue4', type: 'select', ...dict4 }]
                : []
              ),
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
    ] as IDynamicFormItem[];
  }
}
