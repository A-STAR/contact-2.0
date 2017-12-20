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
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { EntityTranslationsService } from '../../../../../../core/entity/translations/entity-translations.service';
import { IContactTreeAttribute } from '../../contact-property.interface';
import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../../core/entity/attributes/entity-attributes.interface';
import { IUserAttributeType } from '../../../../../../core/user/attribute-types/user-attribute-types.interface';
import { IOption } from '../../../../../../core/converter/value-converter.interface';
import { ITreeNode } from '../../../../../components/flowtree/treenode/treenode.interface';

import { ContactPropertyService } from '../../contact-property.service';
import { EntityAttributesService } from '../../../../../../core/entity/attributes/entity-attributes.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserAttributeTypesService } from '../../../../../../core/user/attribute-types/user-attribute-types.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '../../../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { flatten, isEmpty, makeKey, range, valuesToOptions } from '../../../../../../core/utils';

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
    private userAttributeTypesService: UserAttributeTypesService,
    private userDictionariesService: UserDictionariesService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this._formSubscription = combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_DEBT_LIST_1,
        UserDictionariesService.DICTIONARY_DEBT_LIST_2,
        UserDictionariesService.DICTIONARY_DEBT_LIST_3,
        UserDictionariesService.DICTIONARY_DEBT_LIST_4,
      ]),
      this.entityAttributesService.getDictValueAttributes(),
      this.userTemplatesService.getTemplates(4, 0).map(valuesToOptions),
      this.userAttributeTypesService.getAttributeTypes(19, 0),
      this.lookupService.lookupAsOptions('languages'),
      this.isEditing
        ? this.contactPropertyService.fetch(this.contactType, this.treeType, this.selectedId)
        : of(null),
      this.isEditing
        ? this.entityTranslationsService.readContactTreeNodeTranslations(this.selectedId)
        : of([]),
    )
    .pipe(first())
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

  convertToNodes(attributeTypes: IUserAttributeType[], attributeData: IContactTreeAttribute[]): ITreeNode[] {
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
    const { autoCommentIds, template, name, nextCallDays, parentId, ...formData } = this.form.serializedUpdates;

    const attributes = flatten(this.attributeTypes, 'data')
      .filter(attr => attr.isDisplayed)
      .map(attr => ({ code: attr.code, mandatory: Number(attr.isMandatory) }));

    const data = {
      ...formData,
      ...(autoCommentIds ? { autoCommentIds: autoCommentIds.join(',') } : {}),
      ...(name ? { name: this.isEditing ? Object.keys(name).map(k => ({ languageId: k, value: name[k] })) : name } : {}),
      ...(template ? { [template.name]: template.value || null } : {}),
      ...(nextCallDays ? { [nextCallDays.name]: nextCallDays.value || null } : {}),
      ...(isEmpty(attributes) ? {} : { attributes }),
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
              ...range(1, 4).map(i => ({
                label: labelKey(`dictValue${i}`),
                controlName: `dictValue${i}`,
                type: 'selectwrapper',
                dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
                display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]],
              })),
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
