import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

import { IDynamicFormControl } from '../../../../../../../components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '../../../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-grid-call-dialog',
  templateUrl: './debt-grid-call-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridCallDialogComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = [
    { controlName: 'nextCallDateTime', type: 'datepicker' },
    { controlName: 'forAllDebts', type: 'checkbox' },
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.nextCall.${control.controlName}` }) as IDynamicFormControl);

  ngAfterViewInit(): void {
  }

  onSubmit(): void {
    this.submit.emit();
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
