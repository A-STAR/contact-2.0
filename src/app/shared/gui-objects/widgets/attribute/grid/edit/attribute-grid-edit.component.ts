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
import { first } from 'rxjs/operators/first';
import { of } from 'rxjs/observable/of';

import { IAttribute } from '../../attribute.interface';
import {
  IDynamicFormItem,
  IDynamicFormConfig,
  IDynamicFormControl
} from '../../../../../components/form/dynamic-form/dynamic-form.interface';

import { AttributeService } from '../../attribute.service';
import { EntityTranslationsConstants } from '../../../../../../core/entity/translations/entity-translations.interface';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';
import { TYPE_CODES } from '../../../../../../core/utils/value';

const labelKey = makeKey('');

@Component({
  selector: 'app-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent implements OnInit, OnDestroy {
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

  private formSubscription: Subscription;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.formSubscription = combineLatest(
      this.lookupService.lookupAsOptions('dictionaries'),
      this.attributeId ? this.attributeService.fetch(this.treeType, this.treeSubtype, this.attributeId) : of(null),
    )
    .pipe(first())
    .subscribe(([ dictionaries, attribute ]) => {
      // this.cdRef.detectChanges();
      console.log('attributeId', this.attributeId);
      console.log('attribute', attribute);
      if (this.attributeId) {
        // this.getControl('name').options = languages;
        // this.getControl('name').type = 'multitext';
      }
      this.attribute = attribute;
      this.controls = this.getControls();

      // this.form.onCtrlValueChange('typeCode').subscribe(typeCode => {
      //   const code = Array.isArray(typeCode) ? typeCode[0].value : typeCode;
      //   if (code === TYPE_CODES.DICT) {
      //     this.getControl('dictNameCode').options = dictionaries;
      //     this.getControl('dictNameCode').type = 'select';
      //     this.getControl('dictNameCode').required = true;
      //   } else {
      //     this.getControl('dictNameCode').options = undefined;
      //     this.getControl('dictNameCode').type = 'hidden';
      //     this.getControl('dictNameCode').required = false;
      //   }
      // });

      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
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

  private getControl(controlName: string): IDynamicFormControl {
    return (<IDynamicFormControl[]>this.controls).find(control => control.controlName === controlName);
  }

  private getControls(): IDynamicFormItem[] {
    const controls: Partial<IDynamicFormItem>[] = [
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
      { controlName: 'typeCode', type: 'select', dictCode: UserDictionariesService.DICTIONARY_VARIABLE_TYPE },
      { controlName: 'dictNameCode', type: 'hidden' },
      { controlName: 'disabledValue', type: 'checkbox' },
    ];
    return controls as IDynamicFormItem[];
  }
}
