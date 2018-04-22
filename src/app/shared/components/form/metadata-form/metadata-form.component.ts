import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IContextConfig } from '@app/core/context/context.interface';
import {
  IMetadataFormConfig,
  IMetadataFormControl,
  IMetadataFormControlType,
  IMetadataFormFlatConfig,
  IMetadataFormItem,
  IMetadataFormValidator,
} from './metadata-form.interface';

import { ConfigService } from '@app/core/config/config.service';
import { ContextService } from '@app/core/context/context.service';
import { MetadataFormService } from './metadata-form.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { MetadataFormAction } from '@app/shared/components/form/metadata-form/metadata-form.reducer';

import { hasDigits, hasLowerCaseChars, hasUpperCaseChars } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MetadataFormService,
  ],
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent<T> implements OnInit {
  formGroup: FormGroup;
  initialized = false;

  @Input() config: IMetadataFormConfig | string;

  @Input()
  set data(data: Partial<T>) {
    if (data) {
      this._data = data;
      this.populateForm();
    }
  }

  @Input()
  set disabled(disabled: boolean) {
    this.disabled$.next(disabled);
  }

  @Output() submit = new EventEmitter<void>();

  flatConfig: IMetadataFormFlatConfig;

  private _config: IMetadataFormConfig;
  private _data: Partial<T>;

  private flatControls: IMetadataFormControl[];

  private disabled$ = new BehaviorSubject<boolean>(false);

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private contextService: ContextService,
    private httpClient: HttpClient,
    private metadataFormService: MetadataFormService,
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService,
  ) {}

  get formConfig(): IMetadataFormConfig {
    return this._config;
  }

  get canSubmit(): boolean {
    return this.formGroup && this.formGroup.valid && this.formGroup.dirty;
  }

  get data(): Partial<T> {
    return this.formGroup
      ? this.fromFormValue(this.formGroup.value)
      : null;
  }

  ngOnInit(): void {
    if (typeof this.config === 'string') {
      const { assets } = this.configService.config;
      const url = `${assets}/forms/${this.config}.json`;
      this.httpClient.get(url).subscribe((config: IMetadataFormConfig) => {
        this.init(config);
      });
    } else {
      this.init(this.config);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit();
  }

  private init(config: IMetadataFormConfig): void {
    this._config = config;

    this.flatControls = this.flattenControls(config.items);

    const controls = this.flatControls.reduce((acc, item) => {
      const asyncValidators = this.getAsyncValidators(item);
      const disabled = item.disabled || this.disabled$.value;
      return {
        ...acc,
        [item.name]: new FormControl({ value: null, disabled }, { asyncValidators })
      };
    }, {});

    this.formGroup = new FormGroup(controls);

    this.metadataFormService.setPlugins(this.formGroup, config.plugins);

    this.flatControls.forEach(item => {
      if (typeof item.disabled === 'object' && item.disabled !== null) {
          combineLatest(
            this.contextService.calculate(item.disabled as IContextConfig).pipe(
              map(Boolean),
            ),
            this.disabled$,
          ).subscribe(([ a, b ]) => this.disable(item.name, a || b));
      } else {
        this.disabled$.subscribe(d => this.disable(item.name, d));
      }
    });

    this.flatConfig = this.flatControls.reduce((acc, control) => ({
      ...acc,
      [control.name]: {
        display: this.calculateContextValue(control.display),
        required: this.calculateContextValue(control.validators['required']),
      },
    }), {});

    this.populateForm();

    this.initialized = true;
    this.cdRef.markForCheck();

    if (this._config.id) {
      this.formGroup.valueChanges.subscribe(value => this.store.dispatch({
        type: MetadataFormAction.UPDATE_VALUE,
        key: this._config.id,
        payload: { value },
      }));
    }
  }

  private getAsyncValidators(control: IMetadataFormControl): AsyncValidatorFn[] {
    return Object.keys(control.validators || {}).map(key => {
      const value = control.validators[key];
      return typeof value === 'object' && value !== null
        ? c => this.contextService.calculate(value).pipe(
            map(v => this.getValidator(key, v)),
            map(v => v ? v(c) : null),
            first(),
          )
      : c => of(this.getValidator(key, value)(c));
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

  private flattenControls(items: IMetadataFormItem[]): IMetadataFormControl[] {
    return items.reduce((acc, item) => [
      ...acc,
      ...(item.type === IMetadataFormControlType.GROUP ? this.flattenControls(item.children) : [item]),
    ], []);
  }

  private populateForm(): void {
    if (this.formGroup && this._data) {
      const formValue = this.toFormValue(this._data);
      this.formGroup.patchValue(formValue);
    }
  }

  private disable(name: string, disabled: boolean): void {
    const control = this.formGroup.get(name);
    if (disabled) {
      control.disable();
    } else {
      control.enable();
    }
  }

  private toFormValue(data: Partial<T>): any {
    // return Object.keys(data).reduce((acc, key) => {
    //   const control = this.formGroup.controls[key];
    //   acc[key] = this.deserializeControlValue(control.value, this.flatControls.find(c => c.name === key));
    //   return acc;
    // }, {});
    return data;
  }

  private fromFormValue(value: any): Partial<T> {
    // TODO(d.maltsev):
    // check whether the control is displayed
    // or automatically disable it if it's not displayed
    return Object.keys(value).reduce((acc, key) => {
      const control = this.formGroup.controls[key];
      if (control.dirty) {
        acc[key] = this.serializeControlValue(control.value, this.flatControls.find(c => c.name === key));
      }
      return acc;
    }, {});
  }

  private serializeControlValue(value: any, control: IMetadataFormControl): any {
    switch (control.type) {
      case IMetadataFormControlType.DATE:
        return value ? this.valueConverterService.toDateOnly(value) : null;
      case IMetadataFormControlType.CHECKBOX:
        return Number(value);
      default:
        return value;
    }
  }

  // private deserializeControlValue(value: any, control: IMetadataFormControl): any {
  //   switch (control.type) {
  //     case IMetadataFormControlType.DATE:
  //       return value ? this.valueConverterService.fromISO(value) : null;
  //     case IMetadataFormControlType.CHECKBOX:
  //       return Boolean(value);
  //     default:
  //       return value;
  //   }
  // }

  private calculateContextValue(validator: IMetadataFormValidator<any>): Observable<boolean> {
    return typeof validator === 'object' && validator !== null
      ? this.contextService.calculate(validator).pipe(
          map(Boolean),
        )
      : of(validator);
  }
}
