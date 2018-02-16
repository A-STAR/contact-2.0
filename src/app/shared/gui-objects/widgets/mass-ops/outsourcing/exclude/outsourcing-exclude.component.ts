import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ICloseAction, IGridActionParams } from '@app/shared/components/action-grid/action-grid.interface';

import { OutsourcingService } from '../outsourcing.service';

@Component({
  selector: 'app-outsourcing-exclude',
  templateUrl: './outsourcing-exclude.component.html'
})
export class OutsourcingExcludeComponent {

  @Input() actionData: IGridActionParams;
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private outsourcingService: OutsourcingService
  ) { }

  onConfirm(): void {
    this.outsourcingService.exclude(this.actionData.payload)
      .subscribe(() => this.onCloseDialog());
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
