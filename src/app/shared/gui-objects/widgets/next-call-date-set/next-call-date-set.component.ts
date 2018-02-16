import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';

import { ICloseAction, IGridActionParams } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { NextCallDateSetService } from '@app/shared/gui-objects/widgets/next-call-date-set/next-call-date-set.service';
import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.nextCallDateSet.dialog');

@Component({
  selector: 'app-next-call-date-set',
  templateUrl: './next-call-date-set.component.html',
  styleUrls: ['./next-call-date-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextCallDateSetDialogComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() actionData: IGridActionParams;
  @Output() close = new EventEmitter<ICloseAction>();

  private static readonly NEXT_CALL_CONTROL = 'nextCallDate';
  private static readonly MIN_DATE_TIME = moment().set({ h: 0, m: 0, s: 0, ms: 0 }).toDate();

  constructor(
    private nextCallDateSetService: NextCallDateSetService,
  ) {}

  controls: IDynamicFormControl[] = [
    {
      label: labelKey(NextCallDateSetDialogComponent.NEXT_CALL_CONTROL),
      controlName: NextCallDateSetDialogComponent.NEXT_CALL_CONTROL,
      type: 'datetimepicker',
      minDateTime: NextCallDateSetDialogComponent.MIN_DATE_TIME,
      displaySeconds: false,
    }
  ];

  data: any = {
    [NextCallDateSetDialogComponent.NEXT_CALL_CONTROL]: NextCallDateSetDialogComponent.MIN_DATE_TIME,
  };

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  onSubmit(): void {
    const typeCode = this.form.getControl('nextCallDate').value;
    const data = Object.assign({}, this.form.serializedUpdates, { typeCode });
    this.nextCallDateSetService.setNextCall(this.actionData.payload, data.nextCallDate)
      .subscribe((result) => this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed }));
  }

  onClose(): void {
    this.close.emit();
  }
}
