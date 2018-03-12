import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IFormula } from '../formulas.interface';

import { FormulasService } from '../formulas.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-formula-card',
  templateUrl: './formula-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormulaCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'utilities.formulas.card',
  };
  formula: Partial<IFormula>;
  formulaId = Number(this.route.snapshot.paramMap.get('formulaId'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private formulasService: FormulasService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.formulasService.canEdit$,
      this.formulaId ? this.formulasService.fetch(this.formulaId) : of(this.getFormData()),
    )
    .pipe(first())
    .subscribe(([ canEdit, formula ]) => {
      this.formula = formula;
      this.controls = this.initControls(canEdit);
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.formulaId
      ? this.formulasService.update(this.formulaId, this.form.serializedUpdates)
      : this.formulasService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.formulasService.dispatchAction(FormulasService.MESSAGE_FORMULA_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ '/utilities', 'formulas' ]);
  }

  private initControls(canEdit: boolean): IDynamicFormItem[] {
    return [
      { controlName: 'name', type: 'text', disabled: !canEdit, required: true },
      { controlName: 'script', type: 'scripteditor', disabled: !canEdit, required: true },
      {
        controlName: 'typeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_FORMULA_TYPE,
        disabled: !canEdit,
        required: true,
        markAsDirty: !this.formulaId
      },
      { controlName: 'comment', type: 'textarea', disabled: !canEdit },
    ] as IDynamicFormItem[];
  }

  private getFormData(): Partial<IFormula> {
    return {
      typeCode: 1
    };
  }
}
