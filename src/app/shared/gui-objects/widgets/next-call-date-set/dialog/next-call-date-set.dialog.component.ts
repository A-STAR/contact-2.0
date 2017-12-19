import { ChangeDetectionStrategy, ChangeDetectorRef, Component,
  EventEmitter, Output, Input, Inject, ViewChild } from '@angular/core';

import { ICloseAction } from '../../../../components/action-grid/action-grid.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import * as moment from 'moment';
// import { IEntityGroup } from '../../../entity-group/entity-group.interface';

import { NextCallDateSetService } from '../next-call-date-set.service';
import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.actionLog.form');

@Component({
  selector: 'app-next-call-date-set',
  templateUrl: './next-call-date-set.dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextCallDateSetDialogComponent  {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() debts: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private nextCallDateSetService: NextCallDateSetService,
  ) {}

  controls: IDynamicFormControl[] = [
    { label: labelKey('startDate'), controlName: 'nextCallDate', type: 'datepicker',
      displayTime: true, minDate:  moment().toDate(), width: 5 }
  ];

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  onSubmit(): void {
    const typeCode = this.form.getControl('nextCallDate').value;
    const data = Object.assign({}, this.form.serializedUpdates, { typeCode });
    this.close.emit();
    this.nextCallDateSetService.setNextCall(this.debts, data.nextCallDate)
      .subscribe(() => ({}));
  }



  onClose(): void {
    this.close.emit();
  }
}
