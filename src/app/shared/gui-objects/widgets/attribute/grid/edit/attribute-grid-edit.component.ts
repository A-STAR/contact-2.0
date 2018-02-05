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
import { first } from 'rxjs/operators/first';
import { of } from 'rxjs/observable/of';

import { IAttribute } from '../../attribute.interface';
import {
  IDynamicFormItem,
  IDynamicFormConfig,
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { AttributeService } from '../../attribute.service';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { TYPE_CODES } from '@app/core/utils';

@Component({
  selector: 'app-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() attributeId: number;
  @Input() treeType: number;
  @Input() treeSubtype: number;

  @Output() submit = new EventEmitter<Partial<IAttribute>>();
  @Output() cancel = new EventEmitter<void>();

  config: IDynamicFormConfig = {
    labelKey: 'widgets.attribute.grid',
  };
  controls: IDynamicFormItem[];
  attribute: IAttribute;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const action = this.attributeId ? this.attributeService.fetch(this.treeType, this.treeSubtype, this.attributeId) : of(null);
    action.pipe(first())
      .subscribe(attribute => {

        this.attribute = attribute;
        const isDictionary = this.attributeId && this.attribute.typeCode === TYPE_CODES.DICT;
        this.controls = this.getControls(isDictionary);

        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    // const data = this.form.serializedUpdates;
    // const attribute = { ...data, parentId: null };
    this.submit.emit(this.form.serializedUpdates);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private getControls(isDictionary: boolean): IDynamicFormItem[] {
    const controls: IDynamicFormItem[] = [
      {
        controlName: 'name',
        type: this.attributeId ? 'multilanguage' : 'text',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_ATTRIBUTE_TYPE_NAME,
          entityId: this.attribute && this.attribute.id
        },
        required: true
      },
      { controlName: 'code', type: 'number', required: true },
      {
        controlName: 'typeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_VARIABLE_TYPE,
        onChange: (typeCode) => {
          const code = Array.isArray(typeCode) ? typeCode[0].value : typeCode;
          const isDictionaryType = code === TYPE_CODES.DICT;
          const dictNameCodeCtrl = this.form.getControlDef('dictNameCode');
          dictNameCodeCtrl.display = isDictionaryType;
          dictNameCodeCtrl.required = isDictionaryType;
          this.cdRef.markForCheck();
        }
      },
      {
        controlName: 'dictNameCode',
        type: isDictionary ? 'select' : 'text',
        display: isDictionary,
        lookupKey: 'dictionaries'
      },
      { controlName: 'disabledValue', type: 'checkbox' },
      { controlName: 'version', type: 'checkbox' },
    ] as IDynamicFormItem[];

    return controls;
  }
}
