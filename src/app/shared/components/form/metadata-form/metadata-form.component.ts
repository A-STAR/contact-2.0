import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { first, map } from 'rxjs/operators';

import {
  IMetadataFormConfig,
  IMetadataFormControl,
  IMetadataFormControlType,
  IMetadataFormItem,
} from './metadata-form.interface';

import { ContextService } from '@app/core/context/context.service';

import { hasDigits, hasLowerCaseChars, hasUpperCaseChars } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form',
  templateUrl: 'metadata-form.component.html'
})
export class MetadataFormComponent<T> implements OnInit {
  formGroup: FormGroup;

  @Input() config: IMetadataFormConfig;

  @Input()
  set data(data: T) {
    if (data) {
      this._data = data;
      this.populateForm();
    }
  }

  @Output() submit = new EventEmitter<void>();

  private _data: T;

  constructor(
    private contextService: ContextService,
  ) {}

  ngOnInit(): void {
    const flatControls = this.flattenControls(this.config.items);

    const controls = flatControls.reduce((acc, item) => {
      const asyncValidators = this.getAsyncValidators(item);
      const disabled = item.disabled === true;
      return {
        ...acc,
        [item.name]: new FormControl({ value: null, disabled }, { asyncValidators })
      };
    }, {});

    this.formGroup = new FormGroup(controls);

    flatControls.forEach(item => {
      if (typeof item.disabled === 'object' && item.disabled !== null) {
        this.contextService
          .calculate(item.disabled)
          .subscribe((d: boolean) => this.disable(item.name, d));
      }
    });

    this.populateForm();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit();
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
      this.formGroup.patchValue(this._data);
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
}
