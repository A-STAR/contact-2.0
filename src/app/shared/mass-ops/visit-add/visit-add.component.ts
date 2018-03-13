import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { VisitAddService } from './visit-add.service';

import { makeKey } from '@app/core/utils';

const label = makeKey('massOperations.visitAdd');

@Component({
  selector: 'app-visit-add-dialog',
  templateUrl: 'visit-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitAddDialogComponent implements OnInit {
  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  visitsCount: number | string;

  controls: IDynamicFormControl[] = [
    {
      label: label('purposeCode'),
      controlName: 'purposeCode',
      type: 'select',
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
    private cdRef: ChangeDetectorRef,
    private visitAddService: VisitAddService,
  ) {}

  ngOnInit(): void {
    this.visitsCount = this.visitAddService.getVisitsCount(this.actionData.payload);
    this.cdRef.markForCheck();
  }

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
