import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Validators } from '@angular/forms';

import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IContactTreeAttribute } from '../../contact-property.interface';
import { IDynamicFormItem, IDynamicFormConfig } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { ITreeNode } from '../../../../../components/flowtree/treenode/treenode.interface';
import { IUserAttributeType } from '@app/core/user/attribute-types/user-attribute-types.interface';

import { ContactPropertyService } from '../../contact-property.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserAttributeTypesService } from '@app/core/user/attribute-types/user-attribute-types.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { flatten, isEmpty, range, valuesToOptions } from '@app/core/utils';

@Component({
  selector: 'app-contact-property-tree-edit',
  templateUrl: './contact-property-tree-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() contactType: number;
  @Input() isEditing: boolean;
  @Input() treeType: number;
  @Input() selectedId: number;

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  config: IDynamicFormConfig = {
    labelKey: 'widgets.contactProperty.edit',
  };
  controls: IDynamicFormItem[];
  attributeTypes: ITreeNode[] = [];
  data = {};
  tabs = [
    { isInitialised: true },
    { isInitialised: false },
  ];

  private attributeTypesChanged = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactPropertyService: ContactPropertyService,
    private entityAttributesService: EntityAttributesService,
    private userAttributeTypesService: UserAttributeTypesService,
    private userDictionariesService: UserDictionariesService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DEBT_STATUS),
      this.entityAttributesService.getDictValueAttributes(),
      this.userTemplatesService.getTemplates(4, 0).map(valuesToOptions),
      this.userAttributeTypesService.getAttributeTypes(19, 0),
      this.isEditing
        ? this.contactPropertyService.fetch(this.contactType, this.treeType, this.selectedId)
        : of(null),
    )
    .pipe(first())
    .subscribe(([ debtStatusDict, attributes, templates, attributeTypes, data ]) => {
      this.attributeTypes = this.convertToNodes(attributeTypes, data ? data.attributes : []);
      this.data = {
        ...data,
        autoCommentIds: data && data.autoCommentIds
          ? data.autoCommentIds.split(',')
          : null,
        nextCallDays: data && data.nextCallFormula
          ? { name: 'nextCallFormula', value: data && data.nextCallFormula }
          : { name: 'nextCallDays', value: data && data.nextCallDays },
        template: data && data.templateFormula
          ? { name: 'templateFormula', value: data && data.templateFormula }
          : { name: 'templateId', value: data && data.templateId },
        contactTime: '14:05:10'
      };
      this.controls = this.buildControls(debtStatusDict, templates, attributes);

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

  get canSubmit(): boolean {
    return this.form && this.form.isValid && (this.form.isDirty || this.attributeTypesChanged);
  }

  onSubmit(): void {
    const { autoCommentIds, template, nextCallDays, parentId, ...formData } = this.form.serializedUpdates;

    const attributes = flatten(this.attributeTypes, 'data')
      .filter(attr => attr.isDisplayed)
      .map(attr => ({ code: attr.code, mandatory: Number(attr.isMandatory) }));

    const data = {
      ...formData,
      ...(autoCommentIds ? { autoCommentIds: autoCommentIds.join(',') } : {}),
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
    this.attributeTypesChanged = true;
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
    this.attributeTypesChanged = true;
    node.data.isMandatory = value;
    if (value && !node.data.isDisplayed) {
      this.onIsDisplayedChange(true, node);
    }
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  private buildControls(
    debtStatusDict: IOption[],
    templates: IOption[],
    attributes: IEntityAttributes,
  ): IDynamicFormItem[] {
    const debtStatusOptions = debtStatusDict.filter(option => option.value > 20000);
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
    const modeOptions = {
      type: 'select',
      dictCode: UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE,
    };
    const promiseOptions = {
      type: 'select',
      dictCode: UserDictionariesService.DICTIONARY_CONTACT_PROMISE_INPUT_MODE,
    };

    return [
      { controlName: 'code', type: 'text', width: 6, disabled: this.isEditing },
      {
        controlName: 'name',
        type: this.isEditing ? 'multilanguage' : 'text',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_CONTACT_TREE_NAME,
          entityId: this.selectedId
        },
        required: true,
        width: 6
      },
      {
        children: [
          {
            width: 6,
            children: [
              { controlName: 'boxColor', type: 'colorpicker' },
              {
                controlName: 'commentMode',
                type: 'select',
                dictCode: UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE,
              },
              { controlName: 'autoCommentIds', type: 'multiselect', options: templates },
              { controlName: 'fileAttachMode', ...modeOptions },
              { controlName: 'nextCallMode', ...modeOptions },
              { controlName: 'promiseMode', ...promiseOptions },
              { controlName: 'paymentMode', ...promiseOptions },
              { controlName: 'callReasonMode', ...modeOptions },
              // TODO(d.maltsev):  required if statusReasonMode equals 2 or 3
              // See: http://confluence.luxbase.int:8080/browse/WEB20-419
              { controlName: 'debtStatusCode', type: 'select', options: debtStatusOptions },
              {
                controlName: 'statusReasonMode',
                ...modeOptions,
                onChange: ((options: IOption[]) => {
                  // TODO(d.maltsev): make the form return the ready-to-consume value
                  const value = Number(options[0].value);
                  const ctrl = this.form.getControl('debtStatusCode');
                  if ([2, 3].includes(value)) {
                    this.form.getControlDef('debtStatusCode').required = true;
                    ctrl.setValidators([ Validators.required ]);
                  } else {
                    this.form.getControlDef('debtStatusCode').required = false;
                    ctrl.clearValidators();
                  }
                  ctrl.updateValueAndValidity();
                  this.cdRef.markForCheck();
                })
              },
            ]
          },
          {
            width: 6,
            children: [
              { controlName: 'debtReasonMode', ...modeOptions },
              { controlName: 'template', type: 'segmented', ...templateInputOptions },
              { controlName: 'nextCallDays', type: 'segmented', ...nextCallInputOptions },
              ...range(1, 4).map(i => ({
                controlName: `dictValue${i}`,
                type: 'select',
                dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
                // TODO(d.maltsev): check with BA for the rules
                display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
              })),
              { controlName: 'isInvalidContact', type: 'checkbox' },
              { controlName: 'addPhone', type: 'checkbox' },
              { controlName: 'isRefusal', type: 'checkbox' },
              { controlName: 'isSuccess', type: 'checkbox' },
              { controlName: 'changeResponsible', type: 'checkbox' },
              { controlName: 'contactInvisible', type: 'checkbox' },
              { controlName: 'regInvisible', type: 'checkbox' },
              { controlName: 'changeContactPerson', type: 'checkbox' },
              { controlName: 'contactTime', type: 'timepicker' },
            ]
          }
        ]
      },
    ] as IDynamicFormItem[];
  }
}
