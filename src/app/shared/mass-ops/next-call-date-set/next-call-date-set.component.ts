import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { NextCallDateSetService } from './next-call-date-set.service';
import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.nextCallDateSet.dialog');

@Component({
  selector: 'app-next-call-date-set',
  templateUrl: './next-call-date-set.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextCallDateSetDialogComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  private static readonly NEXT_CALL_CONTROL = 'nextCallDate';
  private static readonly MIN_DATE_TIME = moment().toDate();

  constructor(
    private nextCallDateSetService: NextCallDateSetService,
  ) {}

  controls: IDynamicFormControl[] = [
    {
      controlName: NextCallDateSetDialogComponent.NEXT_CALL_CONTROL,
      displaySeconds: false,
      label: labelKey(NextCallDateSetDialogComponent.NEXT_CALL_CONTROL),
      markAsDirty: true,
      minDateTime: NextCallDateSetDialogComponent.MIN_DATE_TIME,
      type: 'datetimepicker',
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
      .subscribe(() => {
        this.close.emit({ refresh: false });
        // this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
