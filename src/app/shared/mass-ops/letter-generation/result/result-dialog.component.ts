import { ChangeDetectionStrategy, Component, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-letter-generation-result',
  templateUrl: './result-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterGenerationResultComponent implements OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Output() close = new EventEmitter<ICloseAction>();

  config: IDynamicLayoutConfig;

  ngOnInit(): void {
  }

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
  }

  onClose(): void {
    this.close.emit();
  }
}
