import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { FormulasService } from '@app/routes/utilities/formulas/formulas.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-formula-calculate-dialog',
  templateUrl: './calculate-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateDialogComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() formulaId: number;

  @Output() close = new EventEmitter<void>();

  controls: IDynamicFormItem[] = [
    { controlName: 'debtId', type: 'number', required: true },
    { controlName: 'userId', type: 'number', required: true },
  ];
  config: IDynamicFormConfig = {
    labelKey: 'utilities.formulas.calculate',
  };

  constructor(
    private formulasService: FormulasService
  ) {}

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    this.formulasService.calculate(this.formulaId, this.form.serializedValue)
      .subscribe(result => {
        this.close.emit();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
