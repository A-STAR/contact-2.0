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
  @Input() attributeId: number;

  @Output() submit = new EventEmitter<Partial<IAttribute>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { label: labelKey('name'), controlName: 'name', type: 'text', required: true },
    { label: labelKey('code'), controlName: 'code', type: 'text', required: true },
    { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', options: [], required: true },
    { label: labelKey('dictNameCode'), controlName: 'dictNameCode', type: 'hidden', options: [], required: true },
    { label: labelKey('disabledValue'), controlName: 'disabledValue', type: 'checkbox' },
  ]
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
      this.attributeId ? this.attributeService.fetch(this.attributeId) : Observable.of(null),
      this.attributeId ? this.entityTranslationsService.readAttributeNameTranslations(this.attributeId) : Observable.of(null),
    ).subscribe(([ types, dictionaries, attribute, translations ]) => {
      this.getControl('typeCode').options = types;
      if (attribute && attribute.typeCode === TYPE_CODES.DICT) {
        this.getControl('dictNameCode').options = dictionaries;
        this.getControl('dictNameCode').type = 'select';
      }
      this.attribute = attribute;
      this.cdRef.markForCheck();

      console.log(translations);
    });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    this.submit.emit(this.form.getSerializedUpdates());
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }
}
