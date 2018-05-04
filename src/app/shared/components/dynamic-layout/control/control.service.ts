import { Injectable, OnDestroy } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first, map } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import {
  DynamicLayoutItemType,
  IDynamicLayoutControl,
  IDynamicLayoutItemProperties,
  IDynamicLayoutItem,
  IDynamicLayoutPlugin,
  DynamicLayoutControlType,
} from '../dynamic-layout.interface';

import { EventService } from '../event/event.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

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
  private groups = new Map<string, FormGroup>();
  private status = new Map<string, Observable<boolean>>();

  private formSubscription = new Subscription();

  constructor(
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
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

    const forms = new Set(this.controls.map(control => this.getControlForm(control.item)));
    forms.forEach(form => this.createFormGroup(form, key));

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

  getStatus(form: string = ControlService.DEFAULT_GROUP_NAME): Observable<boolean> {
    const status = this.status.get(form);
    return status
      ? status
      : of(false);
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

  getFormGroup(control: IDynamicLayoutControl): FormGroup {
    const form = this.getControlForm(control);
    return this.groups.get(form);
  }

  private createFormGroup(name: string, key: string): void {
    const controls = this.controls
      .filter(control => this.getControlForm(control.item) === name)
      .reduce((acc, control) => {
        const asyncValidators = this.getAsyncValidators(control);
        return {
          ...acc,
          [control.item.name]: this.formBuilder.control(null, null, asyncValidators),
        };
      }, {});

    const group = this.formBuilder.group(controls);

    if (key) {
      const subscription = group.valueChanges.subscribe(value => this.store.dispatch({
        // TODO(d.maltsev): write the reducer
        type: null,
        payload: { key, value },
      }));
      this.formSubscription.add(subscription);
    }

    this.groups.set(name, group);

    const status$ = group.statusChanges.pipe(
      map(status => status === 'VALID' && group.dirty),
    );

    this.status.set(name, status$);

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
    const formGroup = this.getFormGroup(control);
    const c = formGroup.get(control.name);
    if (enabled) {
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
        return value;
    }
  }
}