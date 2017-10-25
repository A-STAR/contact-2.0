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

import { IAttribute } from '../../attribute.interface';
import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form.interface';

import { AttributeService } from '../../attribute.service';
import { EntityTranslationsService } from '../../../../../../core/entity/translations/entity-translations.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';
import { TYPE_CODES } from '../../../../../../core/utils/value';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent implements OnInit, OnDestroy {
  @Input() treeType: number;
  @Input() treeSubtype: number;
  @Input() attributeId: number;

  @Output() submit = new EventEmitter<Partial<IAttribute>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { label: labelKey('name'), controlName: 'name', type: 'text', required: true },
    { label: labelKey('code'), controlName: 'code', type: 'number', required: true },
    { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', options: [] },
    { label: labelKey('dictNameCode'), controlName: 'dictNameCode', type: 'hidden', options: [] },
    { label: labelKey('disabledValue'), controlName: 'disabledValue', type: 'checkbox' },
  ];
  attribute: IAttribute;

  private _formSubscription: Subscription;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private entityTranslationsService: EntityTranslationsService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this._formSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_VARIABLE_TYPE),
      this.lookupService.lookupAsOptions('dictionaries'),
      this.lookupService.lookupAsOptions('languages'),
      this.attributeId ? this.attributeService.fetch(this.treeType, this.treeSubtype, this.attributeId) : Observable.of(null),
      this.attributeId ? this.entityTranslationsService.readAttributeNameTranslations(this.attributeId) : Observable.of(null),
    ).subscribe(([ types, dictionaries, languages, attribute, translations ]) => {
      this.cdRef.detectChanges();
      if (this.attributeId) {
        this.getControl('name').options = languages;
        this.getControl('name').type = 'multitext';
      }
      this.getControl('typeCode').options = types;
      this.getControl('typeCode').required = !!this.attributeId;
      this.form.onCtrlValueChange('typeCode').subscribe(typeCode => {
        const code = Array.isArray(typeCode) ? typeCode[0].value : typeCode;
        if (code === TYPE_CODES.DICT) {
          this.getControl('dictNameCode').options = dictionaries;
          this.getControl('dictNameCode').type = 'select';
          this.getControl('dictNameCode').required = true;
        } else {
          this.getControl('dictNameCode').options = undefined;
          this.getControl('dictNameCode').type = 'hidden';
          this.getControl('dictNameCode').required = false;
        }
      });
      if (this.attributeId) {
        this.attribute = {
          ...attribute,
          name: translations
        };
      }
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const formValue = this.form.getSerializedUpdates();
    const data = this.attributeId ? {
      ...formValue,
      name: formValue.name
        ? Object.keys(formValue.name).reduce((acc, k) => [ ...acc, { languageId: k, value: formValue.name[k] } ], [])
        : undefined
    } : formValue;
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }
}
