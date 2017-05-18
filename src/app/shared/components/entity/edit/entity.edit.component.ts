import { Input, OnInit, ViewChild } from '@angular/core';

import { DynamicFormComponent } from '../../form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl } from '../../form/dynamic-form/dynamic-form-control.interface';
import { EntityBasicComponent } from './entity.basic.component';

export abstract class EntityEditComponent<T> extends EntityBasicComponent<T> implements OnInit {

  @Input() editedEntity: T;
  @Input() editedMessage: string;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  protected getSubmitValue(): any {
    return this.form.value;
  }

  protected abstract getControls(): Array<IDynamicFormControl>;
}
