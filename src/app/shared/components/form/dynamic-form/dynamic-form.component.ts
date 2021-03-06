import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import {
  IControls,
  IDynamicFormItem,
  IDynamicFormConfig,
  IDynamicFormControl,
  ISelectItemsPayload,
  IValue,
} from './dynamic-form.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { makeKey } from '@app/core/utils';

import {
  IDynamicFormSelectControl,
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() controls: Array<IDynamicFormItem>;
  @Input() data: IValue;
  @Input() config: IDynamicFormConfig;

  @Output() onSelect = new EventEmitter<ISelectItemsPayload>();
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onValuesChanges = new EventEmitter<IValue>();
  @Output() onStatusChange = new EventEmitter<boolean>();

  form: FormGroup;

  private flatControls: Array<IDynamicFormControl>;
  private valuesChangesSub: Subscription;
  private statusChangeSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private valueConverterService: ValueConverterService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    const config = this.config;

    /**
     * The form has no `config`
    */
    if (!config) {
      this.flatControls = this.flattenFormControls(this.controls);
      this.form = this.createForm(this.flatControls);
      this.valuesChangesSub = this.subOnFormValuesChanges();
      this.statusChangeSub = this.subOnFormStatusChanges();
      this.populateForm();
      this.cdRef.markForCheck();
      return;
    }

    /**
     * This form's `config` is defined
     */

    // set the default config options
    const defaultConfig = { suppressLabelCreation: false };
    this.config = { ...defaultConfig, ...config };

    if (!this.config.suppressLabelCreation) {
      /**
       * 1. set control labels
       * a) when `null` the label will be empty
       * b) when there is a value, the form will use it
       * c) when `undefined`, the form will use the `labelKey` to construct it & translate it
       */
      const label = makeKey(config.labelKey);
      const createLabel = (ctrl: IDynamicFormControl): void => {
        Object.assign(ctrl, { label: ctrl.label === null ? '' : ctrl.label || label(ctrl.controlName) });
      };

      this.walkControlTreeLeafs(this.controls, createLabel);
    }

    // flatten the controls for filtering subsets
    const flatControls = this.flattenFormControls(this.controls);

    // get subsets of `multilanguage` controls & `select` controls with `dictCode` & `lookupKey`
    const dictCodeCtrls = flatControls
      .filter(ctrl => ctrl.type === 'select' && ctrl.dictCode);
    const lookupCtrls = flatControls.filter(ctrl => ctrl.type === 'select' && ctrl.lookupKey);

    combineLatest(
      dictCodeCtrls.length
        ? combineLatest(
            dictCodeCtrls.map((ctrl: IDynamicFormSelectControl) => {
              // log('lookupKey:', ctrl.lookupKey);
              return this.userDictionariesService.getDictionaryAsOptions(ctrl.dictCode);
            })
          )
          .pipe(
            switchMap(dictOptions => {
              // log('dictionary options fetched', dictOptions);
              const map = dictOptions.map((options, i) => {
                // set lookup options for `select` controls
                const ctrl = <IDynamicFormSelectControl>dictCodeCtrls[i];
                ctrl.options = options;
                return ctrl;
              });
              return [map];
            })
          )
        : of([]),

      lookupCtrls.length
        ? combineLatest(
            lookupCtrls.map((ctrl: IDynamicFormSelectControl) => {
              // log('lookupKey:', ctrl.lookupKey);
              return this.lookupService.lookupAsOptions(ctrl.lookupKey);
            })
          )
          .pipe(
            switchMap(lookupOptions => {
              // log('options fetched', lookupOptions);
              const map = lookupOptions.map((options, i) => {
                // set lookup options for `select` controls
                const ctrl = <IDynamicFormSelectControl>lookupCtrls[i];
                ctrl.options = options;
                return ctrl;
              });
              return [map];
            })
          )
        : of([])
    )
    .pipe(first())
    .subscribe(([ dictCtrlsWithOptions, lookupCtrlsWithOptions ]) => {

      // 2. set the dictionary options for `select` controls
      // 3. set the `multilanguage` controls' options
      // 4. set the lookup options for `select` controls'

      dictCtrlsWithOptions
        // .concat(multiLanguageCtrlsWithOptions)
        .concat(lookupCtrlsWithOptions)
        .forEach(control => {
          this.recursivelyMergeControlProps(this.controls, control);
        });

      this.flatControls = this.flattenFormControls(this.controls);
      // log('this.controls', this.controls);
      // log('flatControls', this.flatControls);
      this.form = this.createForm(this.flatControls);
      this.valuesChangesSub = this.subOnFormValuesChanges();
      this.populateForm();
      this.cdRef.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.form) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    if (this.valuesChangesSub) {
      this.valuesChangesSub.unsubscribe();
    }
    if (this.statusChangeSub) {
      this.statusChangeSub.unsubscribe();
    }
  }

  get canSubmit(): boolean {
    return this.form && this.isDirty && this.isValid;
  }

  get isValid(): boolean {
    return this.form && this.form.valid;
  }

  get isDirty(): boolean {
    return this.form && this.form.dirty;
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

  enableControls(controls: IDynamicFormControl[]): void {
    controls.forEach(control => {
      this.form.get(control.controlName).enable();
    });
  }

  createControl(control: IDynamicFormControl): FormControl {
    const options = {
      disabled: control.disabled,
      value: control.type === 'checkbox' ? false : '',
    };

    // TODO(d.maltsev): need to refactor this in favor of built-in control validators
    const controlsWithOwnRequired = [ 'multilanguage', 'select', 'number', 'text', 'textarea', 'file' ];
    const validators = control.required && !controlsWithOwnRequired.includes(control.type)
      ? Validators.compose([
          ...control.validators || [],
          Validators.required
        ])
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

  onFormSubmit(): void {
    this.onSubmit.emit();
  }

  markAsPristine(): void {
    this.form.markAsPristine();
  }

  reset(): void {
    this.form.reset();
  }

  private createForm(flatControls: IDynamicFormControl[]): FormGroup {
    const controls = flatControls.reduce((acc, control: IDynamicFormControl) => {
      acc[control.controlName] = this.createControl(control);
      return acc;
    }, {} as IControls);
    return this.formBuilder.group(controls);
  }

  private flattenFormControls(formControls: IDynamicFormItem[]): IDynamicFormControl[] {
    return formControls.reduce((acc, control: IDynamicFormItem) => {
      const controls = control.children ? this.flattenFormControls(control.children) : control;
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

  private subOnFormValuesChanges(): Subscription {
    // TODO(i.lobanov): think about updates only,
    // also form emits on blur
    return this.form.valueChanges
      .subscribe(values => this.onValuesChanges.emit(values));
  }

  private subOnFormStatusChanges(): Subscription {
    return this.form.statusChanges
      .map(statusStr => statusStr === 'VALID')
      .subscribe(status => this.onStatusChange.emit(status));
  }

  private serializeControlValue(value: any, control: IDynamicFormControl): any {
    switch (control.type) {
      case 'datepicker':
        return ['', null].includes(value)
          ? null
          : this.valueConverterService.toDateOnly(value);
      case 'datetimepicker':
        return ['', null].includes(value)
          ? null
          : this.valueConverterService.toISO(value);
      case 'timepicker':
        return ['', null].includes(value)
          ? null
          : this.valueConverterService.toLocalTime(value);
      case 'boolean':
      case 'checkbox':
        return Number(value);
      case 'select':
      default:
        return value === '' ? null : value;
    }
  }

  private walkControlTreeLeafs = (controls: IDynamicFormItem[], fn: (ctrl: IDynamicFormControl) => void): void => {
    controls.forEach(ctrl => {
      if (!ctrl.children) {
        fn(<IDynamicFormControl>ctrl);
      } else {
        this.walkControlTreeLeafs(ctrl.children, fn);
      }
    });
  }

  private recursivelyMergeControlProps = (
    controls: IDynamicFormItem[],
    control: IDynamicFormControl,
  ): void => {

    controls.forEach((ctrl: IDynamicFormControl) => {
      if (ctrl.children) {
        this.recursivelyMergeControlProps(ctrl.children, control);
      } else {
        if (ctrl.controlName === control.controlName) {
          ctrl = Object.assign({}, control, ctrl);
        }
      }
    });
  }
}
