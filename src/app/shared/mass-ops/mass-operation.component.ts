import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-mass-operation',
  templateUrl: './mass-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MassOperationComponent extends DialogFunctions {

  @Input('type') dialog: string;
  @Input('actionData') dialogData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  get isCustomOperation(): boolean {
    return this.dialogData && !!this.dialogData.id;
  }

  onCloseAction(event: ICloseAction): void {
    this.close.emit(event);
  }

  isAttrChangeDictionaryDlg(): boolean {
    return [
      'changeRegionAttr',
      'changeDict1Attr',
      'changeDict2Attr',
      'changeDict3Attr',
      'changeDict4Attr',
      'changeCreditTypeAttr',
      'changeBranchAttr'
    ].includes(this.dialog);
  }
}
