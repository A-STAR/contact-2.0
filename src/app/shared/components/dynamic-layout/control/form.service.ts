import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  DynamicLayoutItemType,
  IDynamicLayoutControl,
  IDynamicLayoutItemProperties,
  IDynamicLayoutItem,
} from '../dynamic-layout.interface';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class FormService implements OnDestroy {
  private controls: IDynamicLayoutItemProperties<IDynamicLayoutControl>[];
  private groups = new Map<string, FormGroup>();

  private disabledControlsSubscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnDestroy(): void {
    this.disabledControlsSubscription.unsubscribe();
  }

  init(items: Record<string, IDynamicLayoutItemProperties<IDynamicLayoutItem>>): void {
    this.controls = Object.keys(items)
      .map(key => items[key])
      .filter(item => item.item.type === DynamicLayoutItemType.CONTROL)
      .map((item: IDynamicLayoutItemProperties<IDynamicLayoutControl>) => item);

    const forms = new Set(this.controls.map(control => this.getControlForm(control.item)));
    forms.forEach(form => this.createFormGroup(form));

    this.controls.forEach(control => {
      const subscription = control.streams.disabled.subscribe(d => this.disable(control.item, d));
      this.disabledControlsSubscription.add(subscription);
    });
  }

  getFormGroup(control: IDynamicLayoutControl): FormGroup {
    const form = this.getControlForm(control);
    return this.groups.get(form);
  }

  private createFormGroup(name: string): void {
    const controls = this.controls
      .map(control => control.item)
      .filter(item => this.getControlForm(item) === name)
      .reduce((acc, item) => ({ ...acc, [item.name]: this.formBuilder.control(null) }), {});
    const group = this.formBuilder.group(controls);
    this.groups.set(name, group);
  }

  private disable(control: IDynamicLayoutControl, disabled: boolean): void {
    const formGroup = this.getFormGroup(control);
    const c = formGroup.get(control.name);
    if (disabled) {
      c.disable();
    } else {
      c.enable();
    }
  }

  private getControlForm(control: IDynamicLayoutControl): string {
    return control.form || 'default';
  }
}
