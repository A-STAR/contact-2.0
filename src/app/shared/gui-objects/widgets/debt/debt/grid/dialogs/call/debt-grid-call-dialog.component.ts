import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { IDebt } from '../../../debt.interface';
import { IDynamicFormControl } from '../../../../../../../components/form/dynamic-form/dynamic-form.interface';

import { DebtService } from '../../../debt.service';

import { DynamicFormComponent } from '../../../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-grid-call-dialog',
  templateUrl: './debt-grid-call-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridCallDialogComponent {
  @Input() debt: IDebt;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = [
    { controlName: 'nextCallDateTime', type: 'datepicker', displayTime: true },
    { controlName: 'forAllDebts', type: 'checkbox' },
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.nextCall.${control.controlName}` }) as IDynamicFormControl);

  constructor(private debtService: DebtService) {}

  onSubmit(): void {
    this.debtService.setNextCallDate(this.debt.id, this.form.serializedUpdates).subscribe(() => {
      this.submit.emit();
      this.close.emit();
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
