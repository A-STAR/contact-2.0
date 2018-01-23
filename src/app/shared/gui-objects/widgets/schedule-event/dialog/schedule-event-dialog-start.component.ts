import { Component, OnInit, ViewChild } from '@angular/core';

import { IDynamicFormControl, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-schedule-event-dialog-start',
  templateUrl: './schedule-event-dialog-start.component.html',
})
export class ScheduleEventDialogStartComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  config: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.dialog.start',
  };
  controls: IDynamicFormControl[];

  constructor() {}

  ngOnInit(): void {}

  private getControls(): IDynamicFormControl[] {
    return [
      {
        controlName: 'checkGroup',
        type: 'checkbox',
      },
    ] as IDynamicFormControl[];
  }
}
