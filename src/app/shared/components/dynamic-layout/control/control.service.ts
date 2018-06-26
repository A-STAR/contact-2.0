import { Injectable, OnDestroy } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, distinctUntilChanged, first, map } from 'rxjs/operators';
import { getIn } from 'immutable';
import { equals } from 'ramda';

import {
  DynamicLayoutControlType,
  DynamicLayoutItemType,
  IDynamicLayoutControl,
  IDynamicLayoutItem,
  IDynamicLayoutItemProperties,
  IDynamicLayoutPlugin,
} from '../dynamic-layout.interface';

import { EventService } from '../event/event.service';
import { UIService } from '@app/core/ui/ui.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { hasDigits, hasLowerCaseChars, hasUpperCaseChars } from '@app/core/validators';

@Injectable()
export class ControlService implements OnDestroy {
  static readonly DEFAULT_GROUP_NAME = 'default';

  static DEFAULT_MESSAGES = {
    required: 'validation.fieldRequired',
    min: 'validation.fieldMin',
    max: 'validation.fieldMax',
    minlength: 'validation.fieldMinLength',
    hasdigits: 'validation.fieldDigits',
    haslowercasechars: 'validation.fieldLowerCase',
    hasuppercasechars: 'validation.fieldUpperCase',
    multilanguageRequired: 'validation.multilanguageRequired',
    maxsize: 'validation.fieldMaxSize',
    oneofgrouprequired: 'validation.oneOfGroupRequired',
    datepicker: 'validation.datepicker',
    timepicker: 'validation.timepicker'
  };

  private controls: IDynamicLayoutItemProperties<IDynamicLayoutControl>[];
  private data: Record<string, any> = {};
  private groupNames: Set<string>;
  private groups = new Map<string, FormGroup>();
  private key: string;

  private formSubscription = new SubscriptionBag();

  constructor(
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private uiService: UIService,
    private valueConverterService: ValueConverterService,
  ) {}

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  init(
    items: Record<string, IDynamicLayoutItemProperties<IDynamicLayoutItem>>,
    plugins: IDynamicLayoutPlugin[],
    key: string,
  ): void {
    this.controls = Object.keys(items)
      .map(k => items[k])
      .filter(item => item.item.type === DynamicLayoutItemType.CONTROL)
      .map((item: IDynamicLayoutItemProperties<IDynamicLayoutControl>) => item);

    this.key = key;

    this.groupNames = new Set(this.controls.map(control => this.getControlForm(control.item)));
    this.groupNames.forEach(form => this.createFormGroup(form, key));

    this.controls.forEach(control => {
      const { enabled, display } = control.streams;
      const subscription = combineLatest(enabled, display, (a, b) => a && b).subscribe(e => this.enable(control.item, e));
      this.formSubscription.add(subscription);
    });

    this.groups.forEach((group, groupName) => {
      const groupPlugins = plugins.filter(p => this.getPluginForm(p) === groupName);
      this.eventService.setPlugins(group, groupPlugins);
    });
  }

  canSubmit(form: string = ControlService.DEFAULT_GROUP_NAME): Observable<boolean> {
    return this.uiService.getState(this.key).pipe(
      map(state => {
        const f = getIn(state, [ form ], {});
        return f.dirty && f.status === 'VALID';
      }),
    );
  }

  canSubmitAll(mustBeNotEmpty: boolean = false): Observable<boolean> {
    return this.uiService.getState(this.key).pipe(
      map(forms => {
        const groups = Array.from(this.groupNames);
        const valid = groups.reduce((acc, name) => {
          const status = getIn(forms, [ name, 'status' ], false);
          return acc && [ 'VALID', 'DISABLED' ].includes(status);
        }, true);
        const hasValue = groups.reduce((acc, name) => {
          const value = getIn(forms, [ name, 'value' ], {});
          const valueNotEmpty = Object.keys(value).reduce((a, k) => a || Boolean(value[k]), false);
          return acc && valueNotEmpty || !mustBeNotEmpty;
        }, true);
        const dirty = groups.reduce((acc, name) => {
          return acc || getIn(forms, [ name, 'dirty' ], false);
        }, false);
        return valid && hasValue && dirty;
      })
    );
  }

  reset(form: string = ControlService.DEFAULT_GROUP_NAME): void {
    const group = this.groups.get(form);
    if (group) {
      group.reset();
    }
  }

  getData(form: string = ControlService.DEFAULT_GROUP_NAME): any {
    const group = this.groups.get(form);
    return group
      ? this.getGroupValue(group)
      : null;
  }

  setData(data: Record<string, any>): void {
    this.data = data;
    this.patchFormGroups();
  }

  isFormDisabled(form: string = ControlService.DEFAULT_GROUP_NAME): boolean {
    const group = this.groups.get(form);
    return group
      ? group.disabled
      : null;
  }

  getFormGroupForControl(control: IDynamicLayoutControl): FormGroup {
    const form = this.getControlForm(control);
    return this.groups.get(form);
  }

  dispatchChangeStatusAction(form: string, status: string): void {
    this.uiService.updateState(`${this.key}`, { [form]: { status } });
  }

  dispatchChangeValueAction(form: string, dirty: boolean, value: Record<string, any>): void {
    this.uiService.updateState(this.key, { [form]: { dirty } });
    this.uiService.updateState(this.key, { [form]: { value } });
  }

  enableFormGroup(formGroupName: string = ControlService.DEFAULT_GROUP_NAME): void {
    const formGroup = this.groups.get(formGroupName);
    if (formGroup) {
      formGroup.enable();
    }
  }

  disableFormGroup(formGroupName: string = ControlService.DEFAULT_GROUP_NAME): void {
    const formGroup = this.groups.get(formGroupName);
    if (formGroup) {
      formGroup.disable();
    }
  }

  private createFormGroup(name: string, key: string): void {
    const controls = this.controls
      .filter(control => this.getControlForm(control.item) === name)
      .reduce((acc, control) => {
        const asyncValidators = this.getAsyncValidators(control);
        const formControl = this.formBuilder.control(null, null, asyncValidators);
        if (control.item.markAsDirty) {
          formControl.markAsDirty();
        }
        return {
          ...acc,
          [control.item.name]: formControl,
        };
      }, {});

    const group = this.formBuilder.group(controls);

    if (key) {
      const valueSubscription = group.valueChanges
        .pipe(
          distinctUntilChanged(equals),
          debounceTime(100),
        )
        .subscribe(() => this.dispatchChangeValueAction(name, group.dirty, group.getRawValue()));
      const statusSubscription = group.statusChanges
        .pipe(
          distinctUntilChanged(),
          debounceTime(100),
        )
        .subscribe(status => this.dispatchChangeStatusAction(name, status));
      this.formSubscription.add(valueSubscription);
      this.formSubscription.add(statusSubscription);
    }

    this.groups.set(name, group);
    this.patchFormGroups();
  }

  private patchFormGroups(): void {
    Object.keys(this.data).forEach(key => {
      const group = this.groups.get(key);
      if (group && this.data[key]) {
        group.patchValue(this.data[key]);
      }
    });
  }

  private enable(control: IDynamicLayoutControl, enabled: boolean): void {
    const formGroup = this.getFormGroupForControl(control);
    const c = formGroup.get(control.name);
    if (enabled && formGroup.enabled) {
      c.enable();
    } else {
      c.disable();
    }
  }

  private getControlForm(control: IDynamicLayoutControl): string {
    return control.form || ControlService.DEFAULT_GROUP_NAME;
  }

  private getPluginForm(plugin: IDynamicLayoutPlugin): string {
    return plugin.form || ControlService.DEFAULT_GROUP_NAME;
  }

  private getAsyncValidators(control: IDynamicLayoutItemProperties<IDynamicLayoutControl>): AsyncValidatorFn[] {
    const validators = control.streams.validators || {};
    return Object.keys(validators).map(key => {
      return c => validators[key].pipe(
        map(v => this.getValidator(key, v)),
        map(v => v ? v(c) : null),
        first(),
      );
    });
  }

  private getValidator(key: string, value: any): ValidatorFn {
    switch (key) {
      case 'complexity':
        return value ? Validators.compose([ hasDigits, hasLowerCaseChars, hasUpperCaseChars ]) : null;
      case 'required':
        return value ? Validators.required : null;
      case 'minLength':
        return Validators.minLength(value);
      case 'maxLength':
        return Validators.maxLength(value);
      default:
        return null;
    }
  }

  private getGroupValue(group: FormGroup): any {
    return Object.keys(group.value).reduce((acc, key) => {
      const control = group.controls[key];
      if (control.dirty) {
        acc[key] = this.serializeControlValue(control.value, this.controls.find(c => c.item.name === key));
      }
      return acc;
    }, {});
  }

  private serializeControlValue(value: any, control: IDynamicLayoutItemProperties<IDynamicLayoutControl>): any {
    switch (control.item.controlType) {
      case DynamicLayoutControlType.DATE:
        return value ? this.valueConverterService.toDateOnly(value) : null;
      case DynamicLayoutControlType.CHECKBOX:
        return Number(value);
      default:
        return value === '' ? null : value;
    }
  }
}
