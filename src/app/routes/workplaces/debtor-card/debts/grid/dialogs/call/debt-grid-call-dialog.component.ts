import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { Debt } from '@app/entities';

@Component({
  selector: 'app-debt-grid-call-dialog',
  templateUrl: './debt-grid-call-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridCallDialogComponent {
  @Input() debt: Debt;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private static readonly NEXT_CALL_CONTROL = 'nextCallDateTime';
  private static readonly MIN_DATE_TIME = moment().toDate();

  controls: Array<IDynamicFormControl> = [
    {
      controlName: DebtGridCallDialogComponent.NEXT_CALL_CONTROL,
      displaySeconds: false,
      markAsDirty: true,
      minDateTime: DebtGridCallDialogComponent.MIN_DATE_TIME,
      type: 'datetimepicker',
    },
    { controlName: 'forAllDebts', type: 'checkbox' },
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.nextCall.${control.controlName}` }) as IDynamicFormControl);

  data: any = {
    [DebtGridCallDialogComponent.NEXT_CALL_CONTROL]: DebtGridCallDialogComponent.MIN_DATE_TIME,
  };

  constructor(private debtorService: DebtorService) {}

  onSubmit(): void {
    this.debtorService.setNextCallDate(this.debt.id, this.form.serializedUpdates).subscribe(() => {
      this.submit.emit();
      // TODO(d.maltsev): close in container if there are no errors
      this.close.emit();
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
