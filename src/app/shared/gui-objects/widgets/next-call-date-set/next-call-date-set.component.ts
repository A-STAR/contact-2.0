import { ChangeDetectionStrategy, Component,
  EventEmitter, Output, Input, ViewChild, ViewEncapsulation } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import * as moment from 'moment';

import { NextCallDateSetService } from '@app/shared/gui-objects/widgets/next-call-date-set/next-call-date-set.service';
import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.nextCallDateSet.dialog');

@Component({
  selector: 'app-next-call-date-set',
  templateUrl: './next-call-date-set.component.html',
  styleUrls: ['./next-call-date-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NextCallDateSetDialogComponent  {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() debts: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private nextCallDateSetService: NextCallDateSetService,
  ) {}

  controls: IDynamicFormControl[] = [
    {
      label: labelKey('nextCallDate'),
      controlName: 'nextCallDate',
      type: 'datetimepicker',
      displaySeconds: false,
      minDateTime: moment().set({ hour: 0, minute: 0, second: 0 }).toDate(),
      width: 5,
    }
  ];

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  onSubmit(): void {
    const typeCode = this.form.getControl('nextCallDate').value;
    const data = Object.assign({}, this.form.serializedUpdates, { typeCode });
    this.nextCallDateSetService.setNextCall(this.debts, data.nextCallDate)
      .subscribe((result) => this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed }));
  }

  onClose(): void {
    this.close.emit();
  }
}
