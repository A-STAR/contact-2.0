import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-letter-generation-dialog',
  templateUrl: './letter-generation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterGenerationDialogComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Output() close = new EventEmitter<void>();

  controls: IDynamicFormItem[] = [
  ];
  config: IDynamicFormConfig = {
    labelKey: 'routes.workplaces.shared.address.letterDialog',
  };

  get canCalculate(): boolean {
    return this.form && this.form.canSubmit;
  }

  onCalculate(): void {
  }

  onClose(): void {
    this.close.emit();
  }
}
