import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

import { IDynamicFormControl, IDynamicFormGroup } from './dynamic-form-2.interface';

@Component({
  selector: 'app-dynamic-form-2',
  templateUrl: './dynamic-form-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicForm2Component implements OnInit {
  @Input() group: Observable<IDynamicFormGroup>;
  @Input() formValue: Observable<any>;

  rootFormGroup: FormGroup;

  private controls = {};

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    Observable
      .combineLatest(this.group, this.formValue)
      .distinctUntilChanged()
      .subscribe(([ group, value ]) => {
        this.rootFormGroup = this.buildFormGroup(group);
        this.controls = this.flattenControls(group);
        Object.keys(value || {}).forEach(key => {
          const control = this.getControl(key);
          if (control) {
            control.setValue(value[key]);
          }
        });
        this.cdRef.markForCheck();
      });
  }

  get isDirty(): boolean {
    return this.rootFormGroup && this.rootFormGroup.dirty;
  }

  get isValid(): boolean {
    return this.rootFormGroup && this.rootFormGroup.valid;
  }

  get value(): any {
    return Object.keys(this.controls).reduce((acc, key) => {
      const control = this.getControl(key);
      if (control && control.dirty) {
        acc[key] = this.toRequest(control.value, key);
      }
      return acc;
    }, {});
  }

  private getControl(key: string): AbstractControl {
    return this.rootFormGroup && this.controls[key] && this.rootFormGroup.get(this.controls[key].path);
  }

  private flattenControls(group: IDynamicFormGroup, path: string = null): any {
    return group.children.reduce((acc, item) => {
      const p = path ? path + '.' + item.name : item.name;
      return {
        ...acc,
        ...(item.type === 'group' ? this.flattenControls(item, p) : { [item.name]: { path: p, item } })
      };
    }, {});
  }

  private buildFormGroup(group: IDynamicFormGroup): FormGroup {
    const controls = group.children.reduce((acc, item) => ({
      ...acc,
      [item.name]: item.type === 'group' ? this.buildFormGroup(item) : this.buildFormControl(item)
    }), {});
    return new FormGroup(controls, this.composeValidators(group.validators, group.required));
  }

  private buildFormControl(control: IDynamicFormControl): FormControl {
    const options = {
      disabled: false,
      value: control.type === 'checkbox' ? false : ''
    };
    return new FormControl(options, this.composeValidators(control.validators, control.required));
  }

  private composeValidators(validators: ValidatorFn | Array<ValidatorFn>, required: boolean): ValidatorFn {
    const validatorsArray = Array.isArray(validators) ? validators : [ validators ];
    return required ? Validators.compose([ ...validatorsArray, Validators.required]) : Validators.compose(validatorsArray);
  }

  private toRequest(value: any, key: string): any {
    switch (this.controls[key].item.type) {
      case 'select':
        return Array.isArray(value) ? value[0].value : value;
      case 'checkbox':
        return Number(value);
      default:
        return value === '' ? null : value;
    }
  }
}
