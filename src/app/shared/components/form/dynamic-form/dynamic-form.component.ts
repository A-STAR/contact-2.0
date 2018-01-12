import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, switchMap } from 'rxjs/operators';
import * as R from 'ramda';

import {
  IControls,
  IDynamicFormItem,
  IDynamicFormConfig,
  IDynamicFormControl,
  ISelectItemsPayload,
  IValue,
} from './dynamic-form.interface';
import { ILookupLanguage } from '../../../../core/lookup/lookup.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';

import { DataService } from '../../../../core/data/data.service';
import { LookupService } from '../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { makeKey, getTranslations } from '../../../../core/utils';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit, OnChanges {

  @Input() controls: Array<IDynamicFormItem>;
  @Input() data: IValue;
  @Input() config: IDynamicFormConfig;

  @Output() onSelect: EventEmitter<ISelectItemsPayload> = new EventEmitter<ISelectItemsPayload>();

  form: FormGroup;

  private flatControls: Array<IDynamicFormControl>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private valueConverterService: ValueConverterService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    const config = this.config;
    if (config) {
      // set the default config options
      const defaultConfig = { suppressLabelCreation: false };
      this.config = Object.assign(defaultConfig, config);

      if (!config.suppressLabelCreation) {
        // set control labels
        const label = makeKey(config.labelKey);
        const createLabels = (ctrl: IDynamicFormControl) => {
          return !ctrl.children
            ? { ...ctrl, label: ctrl.label || label(ctrl.controlName) }
            : ctrl.children.map(createLabels);
        };
        this.controls = this.controls.map(createLabels);
      }

      const flatControls = this.flattenFormControls(this.controls);
      // fetch & set the dictionary options for select controls
      const dictCodes = flatControls
        .filter(ctrl => ctrl.dictCode && ctrl.type === 'select')
        .map(ctrl => ctrl.dictCode);
      // get a subset of multilanguage controls
      const multiLanguageCtrls = flatControls.filter(ctrl => ctrl.type === 'multilanguage');

      combineLatest(
        this.userDictionariesService.getDictionariesAsOptions(dictCodes),
        this.lookupService.lookup<ILookupLanguage>('languages')
          .pipe(
            switchMap(languages => {
              return combineLatest(
                multiLanguageCtrls.map(ctrl => {
                  // const translations = this.term && this.term.name || [];
                  const langConfig = ctrl.langConfig;
                  return this.dataService.readTranslations(langConfig.entityId, langConfig.entityAttributeId);
                })
              )
              .pipe(
                switchMap(translations => {
                  console.log('translations fetched', translations);
                  const map = translations.map((translation, i) => {
                    // set langOptions for `multilanguage` controls
                    const ctrl = multiLanguageCtrls[i];
                    ctrl.langOptions = getTranslations(languages, translation);
                    return ctrl;
                  });
                  return [map];
                })
              );
            })
          ),
      )
      .pipe(first())
      .subscribe(([ dictionaries, multiLanguageCtrlsWithOptions ]) => {
        console.log('multilangCtrls with options', multiLanguageCtrlsWithOptions);

        Object.keys(dictionaries).forEach(dictCode => {
          const options: IOption[] = dictionaries[dictCode];
          const control = this.recursivelyFindControlByProp(
            <IDynamicFormControl[]>this.controls,
            { dictCode: Number(dictCode) }
          );
          if (control) {
            control.options = options;
          }
        });

        multiLanguageCtrlsWithOptions.forEach(ctrl => {
          const control = this.recursivelyFindControlByProp(
            <IDynamicFormControl[]>this.controls,
            { controlName: ctrl.controlName }
          );
          if (control) {
            control.langOptions = ctrl.langOptions;
          }
        });

        this.flatControls = this.flattenFormControls(this.controls);
        this.form = this.createForm(this.flatControls);
        this.populateForm();
        this.cdRef.markForCheck();
        console.log('flatControls', this.flatControls);
      });

    } else {
      this.flatControls = this.flattenFormControls(this.controls);
      this.form = this.createForm(this.flatControls);
      this.populateForm();
      this.cdRef.markForCheck();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.form) {
      this.populateForm();
    }
  }

  get canSubmit(): boolean {
    return this.form && this.isDirty && this.isValid;
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  get isDirty(): boolean {
    return this.form.dirty;
  }

  /**
   * Loop through all but disabled form controls and convert their values to an object
   *
   * @readonly
   * @type {*}
   * @memberof DynamicFormComponent
   */
  get value(): any {
    return Object.keys(this.form.value).reduce((acc, key) => {
      const control = this.form.get(key);
      if (!control.disabled) {
        acc[key] = control.value === '' ? null : control.value;
      }
      return acc;
    }, {});
  }

  /**
   * Loop through dirty form controls and serialize their values
   *
   * @memberof DynamicFormComponent
   */
  get serializedUpdates(): any {
    return this.getValue(true);
  }

  get serializedValue(): any {
    return this.getValue(false);
  }

  onSelectItems(event: ISelectItemsPayload): void {
    this.onSelect.emit(event);
  }

  disableControls(controls: IDynamicFormControl[]): void {
    controls.forEach(control => {
      this.form.get(control.controlName).disable();
    });
  }

  createControl(control: IDynamicFormControl): FormControl {
    const options = {
      disabled: control.disabled,
      value: control.type === 'checkbox' ? false : '',
    };
    const validators = control.required
      ? Validators.compose([ ...control.validators || [], Validators.required ])
      : control.validators;

    return new FormControl(options, validators);
  }

  /**
   * Find a form control by its name
   *
   * @param controlName string
   * @returns {AbtsractControl}
   */
  getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  /**
   * Creates and then sets or replaces a form control
   *
   * @param control IDynamicFormControl
   */
  setControl(control: IDynamicFormControl): void {
    const ctrl = this.createControl(control);
    this.form.setControl(control.controlName, ctrl);
  }

  /**
   * Find a form control's def by its name
   *
   * @param controlName string
   * @returns {IDynamicFormControl}
   */
  getControlDef(controlName: string): IDynamicFormControl {
    return this.flatControls.find(ctrl => ctrl.controlName === controlName);
  }

  /**
   * Get a flat collection of all form controls
   *
   * @returns {IDynamicFormControl[]}
   */
  getFlatControls(): IDynamicFormControl[] {
    return this.flatControls;
  }

  /**
   * Monitors any changes of a form control's value
   *
   * @param controlName string
   * @returns {Observable<any>}
   */
  onCtrlValueChange(controlName: string): Observable<any> {
    return this.form.get(controlName).valueChanges;
  }

  markAsPristine(): void {
    this.form.markAsPristine();
  }

  reset(): void {
    this.form.reset();
  }

  private getKey = R.compose(R.head, <any>R.keys);

  private recursivelyFindControlByProp = (controls: IDynamicFormControl[], prop: Partial<IDynamicFormControl>) => {
    return controls.find(ctrl => {
      if (ctrl.children) {
        return this.recursivelyFindControlByProp(ctrl.children, prop);
      }
      const key = this.getKey(prop);
      return ctrl[key] === prop[key];
    });
  }

  private createForm(flatControls: Array<IDynamicFormControl>): FormGroup {
    const controls = flatControls.reduce((acc, control: IDynamicFormControl) => {
      acc[control.controlName] = this.createControl(control);
      return acc;
    }, {} as IControls);
    return this.formBuilder.group(controls);
  }

  private flattenFormControls(formControls: Array<IDynamicFormItem>): Array<IDynamicFormControl> {
    return formControls.reduce((acc, control: IDynamicFormItem) => {
      const controls = control.children ? this.flattenFormControls(control.children) : [ control ];
      return acc.concat(controls);
    }, []);
  }

  private populateForm(): void {
    if (this.data) {
      this.form.patchValue(this.data);
      // run markAsDirty for fields having this property set to true
      this.flatControls
        .filter((control: IDynamicFormControl) => !!control.markAsDirty)
        .forEach((control: IDynamicFormControl) => {
          this.form.get(control.controlName).markAsDirty();
        });
    }
  }

  private getValue(onlyUpdatedValues: boolean): any {
    return Object.keys(this.form.value).reduce((acc, key) => {
      const control = this.form.controls[key];
      if (!onlyUpdatedValues || control.dirty) {
        acc[key] = this.serializeControlValue(control.value, this.flatControls.find(c => c.controlName === key));
      }
      return acc;
    }, {});
  }

  private serializeControlValue(value: any, control: IDynamicFormControl): any {
    switch (control.type) {
      case 'select':
      case 'selectwrapper':
        if (['nameTranslations', 'translatedName'].includes(control.controlName) || !Array.isArray(value)) {
          return value;
        }
        return control.multiple ? value.map(item => item.value) : value[0].value;
      case 'multilanguage': {
        // TODO(a.tymchuk): replace with proper type instead of ILabeledValue
        const values = value
          .filter((o: any) => o.isUpdated)
          .map((o: any) => ({ languageId: o.languageId, value: o.value }));
        return values.length ? values : undefined;
      }
      case 'datepicker':
        return ['', null].includes(value)
          ? null
          : control.displayTime
            ? this.valueConverterService.toISO(value)
            : this.valueConverterService.toDateOnly(value);
      case 'boolean':
      case 'checkbox':
        return Number(value);
      default:
        return value === '' ? null : value;
    }
  }
}
