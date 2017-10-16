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

import { EntityTranslationsService } from '../../../../../../core/entity/translations/entity-translations.service';
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
import { UserTemplatesService } from '../../../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { flatten, isEmpty, makeKey, valuesToOptions } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.contactProperty.edit');

@Component({
  selector: 'app-contact-property-tree-edit',
  templateUrl: './contact-property-tree-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeEditComponent implements OnInit, OnDestroy {
  @Input() contactType: number;
  @Input() isEditing: boolean;
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
    private entityTranslationsService: EntityTranslationsService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this._formSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_DEBT_LIST_1,
        UserDictionariesService.DICTIONARY_DEBT_LIST_2,
        UserDictionariesService.DICTIONARY_DEBT_LIST_3,
        UserDictionariesService.DICTIONARY_DEBT_LIST_4,
      ]),
      this.entityAttributesService.getAttributes([
        EntityAttributesService.DICT_VALUE_1,
        EntityAttributesService.DICT_VALUE_2,
        EntityAttributesService.DICT_VALUE_3,
        EntityAttributesService.DICT_VALUE_4,
      ]),
      this.userTemplatesService.getTemplates(4, 0).map(valuesToOptions),
      this.lookupService.attributeTypes,
      this.lookupService.lookupAsOptions('languages'),
      this.isEditing
        ? this.contactPropertyService.fetch(this.contactType, this.treeType, this.selectedId)
        : Observable.of(null),
      this.isEditing
        ? this.entityTranslationsService.readContactTreeNodeTranslations(this.selectedId)
        : Observable.of([]),
    )
    .take(1)
    .subscribe(([ dictionaries, attributes, templates, attributeTypes, languages, data, nameTranslations ]) => {
      this.controls = this.buildControls(dictionaries, templates, attributes, languages);
      this.attributeTypes = this.convertToNodes(attributeTypes, data ? data.attributes : []);
      this.data = {
        ...data,
        autoCommentIds: data && data.autoCommentIds
          ? data.autoCommentIds.split(',')
          : null,
        name: nameTranslations,
        nextCallDays: data && data.nextCallFormula
          ? { name: 'nextCallFormula', value: data && data.nextCallFormula }
          : { name: 'nextCallDays', value: data && data.nextCallDays },
        template: data && data.templateFormula
          ? { name: 'templateFormula', value: data && data.templateFormula }
          : { name: 'templateId', value: data && data.templateId },
      };
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
    const { autoCommentIds, template, name, nextCallDays, parentId, ...formData } = this.form.getSerializedUpdates();

    const attribute = flatten(this.attributeTypes, 'data')
      .filter(attr => attr.isDisplayed)
      .map(attr => ({ code: attr.code, mandatory: attr.isMandatory }))
    const data = {
      ...formData,
      ...(autoCommentIds ? { autoCommentIds: autoCommentIds.join(',') } : {}),
      ...(name ? { name: this.isEditing ? Object.keys(name).map(k => ({ languageId: k, value: name[k] })) : name } : {}),
      ...(template ? { [template.name]: template.value } : {}),
      ...(nextCallDays ? { [nextCallDays.name]: nextCallDays.value } : {}),
      ...(isEmpty(attribute) ? {} : { attribute }),
      ...(this.isEditing ? {} : { parentId: this.selectedId }),
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
    templates: IOption[],
    attributes: IEntityAttributes,
    languages: IOption[],
  ): IDynamicFormItem[] {
    const debtStatusOptions = dictionaries[UserDictionariesService.DICTIONARY_DEBT_STATUS].filter(option => option.value > 20000);
    const dict1Attributes = attributes[EntityAttributesService.DICT_VALUE_1];
    const dict2Attributes = attributes[EntityAttributesService.DICT_VALUE_2];
    const dict3Attributes = attributes[EntityAttributesService.DICT_VALUE_3];
    const dict4Attributes = attributes[EntityAttributesService.DICT_VALUE_4];
    const dict1 = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_DEBT_LIST_1,
      required: dict1Attributes.isMandatory,
    }
    const dict2 = {
      dictCode: UserDictionariesService.DICTIONARY_DEBT_LIST_2,
      type: 'selectwrapper',
      required: dict2Attributes.isMandatory,
    }
    const dict3 = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_DEBT_LIST_3,
      required: dict3Attributes.isMandatory,
    }
    const dict4 = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_DEBT_LIST_4,
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
    const nameOptions = {
      type: this.isEditing ? 'multitext' : 'text',
      options: languages,
    };

    const modeOptions = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE,
    };
    const promiseOptions = {
      type: 'selectwrapper',
      dictCode: UserDictionariesService.DICTIONARY_CONTACT_PROMISE_INPUT_MODE,
    };

    return [
      { label: labelKey('code'), controlName: 'code', type: 'text', width: 3, disabled: this.isEditing },
      { label: labelKey('name'), controlName: 'name', ...nameOptions, required: true, width: 6 },
      { label: labelKey('boxColor'), controlName: 'boxColor', type: 'colorpicker', width: 3 },
      {
        children: [
          {
            width: 6,
            children: [
              { label: labelKey('commentMode'), controlName: 'commentMode', ...modeOptions },
              { label: labelKey('autoCommentIds'), controlName: 'autoCommentIds', type: 'multiselect', options: templates },
              { label: labelKey('fileAttachMode'), controlName: 'fileAttachMode', ...modeOptions },
              { label: labelKey('nextCallMode'), controlName: 'nextCallMode', ...modeOptions },
              { label: labelKey('promiseMode'), controlName: 'promiseMode', ...promiseOptions },
              { label: labelKey('paymentMode'), controlName: 'paymentMode', ...promiseOptions },
              { label: labelKey('callReasonMode'), controlName: 'callReasonMode', ...modeOptions },
              { label: labelKey('debtStatusCode'), controlName: 'debtStatusCode', type: 'select', options: debtStatusOptions },
              { label: labelKey('statusReasonMode'), controlName: 'statusReasonMode', ...modeOptions },
              { label: labelKey('debtReasonMode'), controlName: 'debtReasonMode', ...modeOptions },
            ]
          },
          {
            width: 6,
            children: [
              { label: labelKey('template'), controlName: 'template', type: 'segmented', ...templateInputOptions },
              { label: labelKey('nextCallDays'), controlName: 'nextCallDays', type: 'segmented', ...nextCallInputOptions },
              ...(dict1Attributes.isUsed
                ? [{ label: labelKey('dictValue1'), controlName: 'dictValue1', ...dict1 }]
                : []
              ),
              ...(dict2Attributes.isUsed
                ? [{ label: labelKey('dictValue2'), controlName: 'dictValue2', ...dict2 }]
                : []
              ),
              ...(dict3Attributes.isUsed
                ? [{ label: labelKey('dictValue3'), controlName: 'dictValue3', ...dict3 }]
                : []
              ),
              ...(dict4Attributes.isUsed
                ? [{ label: labelKey('dictValue4'), controlName: 'dictValue4', ...dict4 }]
                : []
              ),
              { label: labelKey('isInvalidContact'), controlName: 'isInvalidContact', type: 'checkbox' },
              { label: labelKey('addPhone'), controlName: 'addPhone', type: 'checkbox' },
              { label: labelKey('isRefusal'), controlName: 'isRefusal', type: 'checkbox' },
              { label: labelKey('isSuccess'), controlName: 'isSuccess', type: 'checkbox' },
              { label: labelKey('changeResponsible'), controlName: 'changeResponsible', type: 'checkbox' },
              { label: labelKey('contactInvisible'), controlName: 'contactInvisible', type: 'checkbox' },
              { label: labelKey('regInvisible'), controlName: 'regInvisible', type: 'checkbox' },
            ]
          }
        ]
      },
    ] as IDynamicFormItem[];
  }
}
