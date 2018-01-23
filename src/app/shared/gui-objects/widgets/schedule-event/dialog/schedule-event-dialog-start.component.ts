import { Component, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';

import { IDynamicFormControl, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-schedule-event-dialog-start',
  templateUrl: './schedule-event-dialog-start.component.html',
})
export class ScheduleEventDialogStartComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Output() cancel = new EventEmitter<void>();
  @Output() action = new EventEmitter<0 | 1>();

  config: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.dialog.start',
  };
  controls: IDynamicFormControl[];

  constructor() {}

  ngOnInit(): void {
    this.controls = this.getControls();
  }

  onClose(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const { checkGroup } = this.form.serializedValue;
    this.action.emit(checkGroup);
  }

  private getControls(): IDynamicFormControl[] {
    return [
      {
        controlName: 'checkGroup',
        type: 'checkbox',
      },
    ] as IDynamicFormControl[];
  }
}
