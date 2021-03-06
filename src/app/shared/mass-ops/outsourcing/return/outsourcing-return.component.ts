import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { OutsourcingService } from '../outsourcing.service';

@Component({
  selector: 'app-outsourcing-return',
  templateUrl: './outsourcing-return.component.html'
})
export class OutsourcingReturnComponent {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private outsourcingService: OutsourcingService
  ) { }

  onConfirm(): void {
    this.outsourcingService.return(this.actionData.payload)
      .subscribe(() => this.onCloseDialog());
  }

  onCloseDialog(): void {
    this.close.emit();
  }

}
