import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IPortfolio } from '../../contractors-and-portfolios.interface';

@Component({
  selector: 'app-portfolio-move',
  templateUrl: './portfolio-move.component.html'
})
export class PortfolioMoveComponent {
  @Input() portfolio: IPortfolio;
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  get canSubmit(): boolean {
    return true;
  }

  submit(): void {
    this.onSubmit.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
