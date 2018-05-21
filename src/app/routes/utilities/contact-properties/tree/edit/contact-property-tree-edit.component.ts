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
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IContactTreeAttribute } from '../../contact-properties.interface';
import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';
import { IUserAttributeType } from '@app/core/user/attribute-types/user-attribute-types.interface';

import { ContactPropertyService } from '../../contact-properties.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserAttributeTypesService } from '@app/core/user/attribute-types/user-attribute-types.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { ActionCheckboxRendererComponent } from '@app/shared/components/grids/renderers';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { isEmpty, range, valuesToOptions, addGridLabel } from '@app/core/utils';
import { CellValueChangedEvent } from 'ag-grid';

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
  attributes: any[] = [];
  data = {};
  tabs = [
    { isInitialised: true },
    { isInitialised: false },
  ];

  columns: Array<ISimpleGridColumn<IAttribute>> = [
    {
      prop: 'code', minWidth: 50, maxWidth: 80,
    },
    {
      prop: 'name', minWidth: 150, maxWidth: 200, isGroup: true,
    },
    {
      prop: 'isDisplayed', minWidth: 50, maxWidth: 100, renderer: ActionCheckboxRendererComponent,
      actionParams: {
        dataKeys: [ 'isDisplayed', 'isMandatory' ],
        mask: [
          [ 3, 1, 0 ],
          [ 0, 1, 3 ]
        ],
        parentsMask: [
          [ 0, 2, 0, 2 ],
          [ 0, 2, 1, 2 ],
          [ 0, 3, 0, 2 ],
          [ 0, 3, 1, 2 ],
        ],
        childrenMask: [
          [ 2, 1, 2, 0 ],
          [ 2, 1, 3, 0 ],
          [ 3, 2, 2, 0 ],
          [ 3, 2, 3, 0 ],
          [ 2, 0, 2, 0 ],
          [ 2, 0, 3, 0 ],
        ],
      }
    },
    {
      prop: 'isMandatory', minWidth: 50, maxWidth: 100, renderer: ActionCheckboxRendererComponent,
      rendererParams: { isDisplayed: data => data.disabledValue !== 1 },
    },
  ].map(addGridLabel('widgets.contactProperty.dialogs.edit.attributes'));

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
          ? data.autoCommentIds.split(',').map(Number)
          : null,
        nextCallDays: data && data.nextCallFormula
          ? { name: 'nextCallFormula', value: data && data.nextCallFormula }
          : { name: 'nextCallDays', value: data && data.nextCallDays },
        template: data && data.templateFormula
          ? { name: 'templateFormula', value: data && data.templateFormula }
          : { name: 'templateIdList', value: data && data.templateIdList },
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
            ...data,
            isMandatory: !!attributeDataItem && !!attributeDataItem.mandatory,
            isDisplayed: !!attributeDataItem,
            ...(hasChildren ? { children: this.convertToNodes(children, attributeDataItem && attributeDataItem.children) } : {}),
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  get canSubmit(): boolean {
    return this.form && this.form.isValid && (this.form.isDirty || this.attributeTypesChanged);
  }

  onSubmit(): void {
    const { autoCommentIds, template, nextCallDays, parentId, ...formData } = this.form.serializedUpdates;

    const attributes = this.attributes
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

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onCellValueChanged($event: CellValueChangedEvent): void {
    const index = this.attributes.findIndex(a => a.code === $event.data.code);
    if (index === -1) {
      this.attributes.push($event.data);
    } else {
      this.attributes[index] = $event.data;
    }
    this.attributeTypesChanged = !!this.attributes.length;
  }

  private buildControls(
    debtStatusDict: IOption[],
    templates: IOption[],
    attributes: IEntityAttributes,
  ): IDynamicFormItem[] {
    const debtStatusOptions = debtStatusDict.filter(option => option.value > 20000);
    const templateInputOptions = {
      segmentedInputOptions: [
        { name: 'templateIdList', label: 'widgets.contactProperty.dialogs.edit.values', mask: { delimeter: ',' } },
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
