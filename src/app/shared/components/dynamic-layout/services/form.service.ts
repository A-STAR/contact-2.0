import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  DynamicLayoutItemType,
  IDynamicLayoutControl,
  IDynamicLayoutItemProperties,
} from '../interface';

@Injectable()
export class FormService {
  private controls: IDynamicLayoutControl[];
  private groups = new Map<string, FormGroup>();

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  init(items: { [key: string]: IDynamicLayoutItemProperties }): void {
    this.controls = Object.keys(items)
      .map(key => items[key].item)
      .filter(item => item.type === DynamicLayoutItemType.CONTROL)
      .map((control: IDynamicLayoutControl) => control);

    const forms = new Set(this.controls.map(control => control.form || 'default'));
    forms.forEach(form => this.createFormGroup(form));

    // tslint:disable-next-line:no-console
    console.log(this.groups);
  }

  getFormGroup(control: IDynamicLayoutControl): FormGroup {
    return this.groups.get(control.form || 'default');
  }

  private createFormGroup(name: string): void {
    const controls = this.controls
      .filter(control => (control.form || 'default') === name)
      .reduce((acc, control) => ({ ...acc, [control.name]: this.formBuilder.control(null) }), {});
    const group = this.formBuilder.group(controls);
    this.groups.set(name, group);
  }
}
