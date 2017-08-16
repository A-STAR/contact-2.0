import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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

  @Input('value')
  set value(value: any) {
    // TODO(d.maltsev): convert value to nested structure
    this.rootFormGroup.patchValue(value);
  }

  rootFormGroup: FormGroup;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.group
      .distinctUntilChanged()
      .subscribe(group => {
        this.rootFormGroup = this.buildFormGroup(group);
        this.cdRef.markForCheck();
      });
  }

  get isDirty(): boolean {
    return this.rootFormGroup.dirty;
  }

  get isValid(): boolean {
    return this.rootFormGroup.valid;
  }

  get value(): any {
    // TODO(d.maltsev): convert value to flat structure
    // console.log(this.rootFormGroup.get('baz.foobar'));
    return this.rootFormGroup.value;
  }

  private buildFormGroup(group: IDynamicFormGroup): FormGroup {
    const controls = group.children.reduce((acc, item) => ({
      ...acc,
      [item.name]: item.type === 'group' ? this.buildFormGroup(item) : this.buildFormControl(item)
    }), {});
    return new FormGroup(controls, this.composeValidators(group.validators));
  }

  private buildFormControl(control: IDynamicFormControl): FormControl {
    const options = { disabled: false, value: '' };
    return new FormControl(options, control.validators);
  }

  private composeValidators(validators: ValidatorFn | Array<ValidatorFn>): ValidatorFn {
    return Array.isArray(validators) ? Validators.compose(validators) : validators;
  }
}
