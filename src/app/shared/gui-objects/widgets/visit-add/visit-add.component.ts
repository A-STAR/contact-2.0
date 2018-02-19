import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { VisitAddService } from './visit-add.service';

import { makeKey } from '../../../../core/utils';

const label = makeKey('massOperations.visitAdd');

@Component({
  selector: 'app-visit-add-dialog',
  templateUrl: 'visit-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitAddDialogComponent {
  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    {
      label: label('purposeCode'),
      controlName: 'purposeCode',
      type: 'selectwrapper',
      required: true,
      dictCode: UserDictionariesService.DICTIONARY_VISIT_PURPOSE,
    },
    {
      label: label('comment'),
      controlName: 'comment',
      type: 'textarea',
    },
  ];

  constructor(
    private visitAddService: VisitAddService,
  ) {}

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    this.visitAddService
      .createVisit(this.actionData.payload, data)
      .subscribe(() => this.onCancel());
  }

  onCancel(): void {
    this.close.emit();
  }
}
