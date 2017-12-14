import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IVisitParams } from './visit-add.interface';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { VisitAddService } from './visit-add.service';

import { makeKey } from '../../../../core/utils';

const label = makeKey('massOperations.visitAdd');

@Component({
  selector: 'app-visit-add-dialog',
  templateUrl: 'visit-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitAddDialogComponent {
  @Input() visitParams: IVisitParams[];

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
    const actionData = this.form.serializedUpdates;
    this.visitAddService
      .createVisit(this.visitParams, actionData)
      .subscribe(() => this.onCancel());
  }

  onCancel(): void {
    this.close.emit();
  }
}
