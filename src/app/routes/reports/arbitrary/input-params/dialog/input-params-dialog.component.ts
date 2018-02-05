import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';

import { ParamsService } from '../params.service';

import { InputParamsCardComponent } from '../card/params-card.component';

@Component({
  selector: 'app-arbitrary-input-params-dialog',
  templateUrl: './input-params-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputParamsDialogComponent {

  @Input() reportId: number;

  @Output() close = new EventEmitter<boolean>();

  @ViewChild(InputParamsCardComponent) card: InputParamsCardComponent;

  constructor(
    private paramsService: ParamsService,
  ) {}

  get canSubmit(): boolean {
    return this.card && this.card.canSubmit;
  }

  onSubmit(): void {
    this.paramsService.create(this.reportId, this.card.inputParamsValues)
      .subscribe(() => this.close.emit());
  }

  onClose(): void {
    this.close.emit();
  }
}
