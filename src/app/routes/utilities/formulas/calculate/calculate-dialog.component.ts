import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, ViewChild, ChangeDetectorRef } from '@angular/core';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IFormula, IFormulaResult } from '@app/routes/utilities/formulas/formulas.interface';

import { FormulasService } from '@app/routes/utilities/formulas/formulas.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { addGridLabel } from '@app/core/utils';

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
    { controlName: 'debtId', type: 'number', required: true, width: 6 },
    { controlName: 'userId', type: 'number', required: true, width: 6 },
  ];
  config: IDynamicFormConfig = {
    labelKey: 'utilities.formulas.calculate',
  };

  columns: ISimpleGridColumn<IFormula>[] = [
    { prop: 'type', dictCode: UserDictionariesService.DICTIONARY_VARIABLE_TYPE },
    { prop: 'value' },
  ].map(addGridLabel('utilities.formulas.calculate.grid'));

  result: IFormulaResult;

  constructor(
    private cdRef: ChangeDetectorRef,
    private formulasService: FormulasService
  ) {}

  get canCalculate(): boolean {
    return this.form && this.form.canSubmit;
  }

  onCalculate(): void {
    this.formulasService.calculate(this.formulaId, this.form.serializedValue)
      .subscribe(result => {
        this.result = result;
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
