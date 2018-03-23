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

import { IAttribute } from './contact-property-tree-edit.interface';
import { IAGridWrapperTreeColumn } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IContactTreeAttribute } from '../../contact-properties.interface';
import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';
import { IUserAttributeType } from '@app/core/user/attribute-types/user-attribute-types.interface';

import { ContactPropertyService } from '../../contact-properties.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserAttributeTypesService } from '@app/core/user/attribute-types/user-attribute-types.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { CheckboxRendererComponent } from '@app/shared/components/grids/renderers';

import { flatten, isEmpty, makeKey, range, TYPE_CODES, valuesToOptions } from '@app/core/utils';

const label = makeKey('widgets.contactProperty.dialogs.edit.attributes');

@Component({
  selector: 'app-contact-property-tree-edit',
  templateUrl: './contact-property-tree-edit.component.html',
  styleUrls: [ './contact-property-tree-edit.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() contactType: number;
  @Input() isEditing: boolean;
  @Input() selectedId: number;
  @Input() treeType: number;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

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

  columns: Array<IAGridWrapperTreeColumn<IAttribute>> = [
    { dataType: TYPE_CODES.STRING, name: 'code', isDataPath: true },
    { dataType: TYPE_CODES.STRING, name: 'name' },
    { dataType: TYPE_CODES.BOOLEAN, name: 'isDisplayed', cellRendererFramework: CheckboxRendererComponent },
    { dataType: TYPE_CODES.BOOLEAN, name: 'isMandatory', cellRendererFramework: CheckboxRendererComponent },
  ].map(col => ({ ...col, label: label(col.name)}));

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
      };
      this.controls = this.buildControls(debtStatusDict, templates, attributes);
      this.cdRef.markForCheck();
    });
  }

  convertToNodes(attributeTypes: IUserAttributeType[], attributeData: IContactTreeAttribute[]): any {
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

  updateDisplayedField(nodes: any[], code: number, value: boolean): any[] {
    return nodes.reduce((acc, node) => {
      const isMatch = node.data.code === code;
      const { isDisplayed, isMandatory } = node.data;
      return [
        ...acc,
        {
          ...node,
          data: {
            ...node.data,
            isDisplayed: isMatch ? value : isDisplayed,
            isMandatory: isMatch ? isMandatory && value : isMandatory,
          },
          ...(node.children ? { children: this.updateDisplayedField(node.children, code, value) } : {}),
        }
      ];
    }, []);
  }

  onIsDisplayedChange(event: any): void {
    const codes = event.data.code;
    this.attributeTypes = this.updateDisplayedField(this.attributeTypes, codes[codes.length - 1], event.newValue);

    // TODO(d.maltsev): traverse the tree and update ancestors' and descendants' attributes
    // this.attributeTypesChanged = true;
    // node.data.isDisplayed = value;
    // if (!value && node.data.isMandatory) {
    //   node.data.isMandatory = false;
    // }
    // if (traverseUp && !!node.parent) {
    //   const isParentDisplayed = node.parent.children.reduce((acc, child) => acc || !!child.data.isDisplayed, false);
    //   this.onIsDisplayedChange(isParentDisplayed, node.parent, true, false);
    // }
    // if (traverseDown && !!node.children) {
    //   node.children.forEach(child => this.onIsDisplayedChange(value, child, false, true));
    // }
    // if (traverseUp && traverseDown) {
    //   this.cdRef.markForCheck();
    // }
  }

  updateMandatoryField(nodes: any[], code: number, value: boolean): any[] {
    return nodes.reduce((acc, node) => {
      const isMatch = node.data.code === code;
      const { isDisplayed, isMandatory } = node.data;
      return [
        ...acc,
        {
          ...node,
          data: {
            ...node.data,
            isMandatory: isMatch ? value : isMandatory,
            isDisplayed: isMatch ? isDisplayed || value : isDisplayed,
          },
          ...(node.children ? { children: this.updateMandatoryField(node.children, code, value) } : {}),
        }
      ];
    }, []);
  }

  onIsMandatoryChange(event: any): void {
    const codes = event.data.code;
    this.attributeTypes = this.updateMandatoryField(this.attributeTypes, codes[codes.length - 1], event.newValue);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onCellValueChanged(event: any): void {
    this.attributeTypesChanged = true;
    switch (event.colDef.field) {
      case 'isDisplayed':
        this.onIsDisplayedChange(event);
        break;
      case 'isMandatory':
        this.onIsMandatoryChange(event);
        break;
    }
    this.cdRef.markForCheck();
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
      {
        children: [
          {
            width: 4,
            children: [
              { controlName: 'code', type: 'text', disabled: this.isEditing },
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
            ]
          },
          {
            width: 4,
            children: [
              {
                controlName: 'names',
                type: 'multilanguage',
                langConfig: {
                  entityAttributeId: EntityTranslationsConstants.SPEC_CONTACT_TREE_NAME,
                  entityId: this.selectedId
                },
                createMode: !this.isEditing,
                required: true
              },
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
            ]
          },
          {
            width: 4,
            children: [
              { controlName: 'isInvalidContact', type: 'checkbox' },
              { controlName: 'addPhone', type: 'checkbox' },
              { controlName: 'isRefusal', type: 'checkbox' },
              { controlName: 'isSuccess', type: 'checkbox' },
              { controlName: 'changeResponsible', type: 'checkbox' },
              { controlName: 'contactInvisible', type: 'checkbox' },
              { controlName: 'regInvisible', type: 'checkbox' },
              { controlName: 'changeContactPerson', type: 'checkbox' },
            ]
          }
        ]
      },
    ] as IDynamicFormItem[];
  }
}
