import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { invert } from '@app/core/utils';

@Component({
  selector: 'app-mass-custom-operation',
  templateUrl: './custom-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationComponent implements AfterViewInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  isDisabled$ = of(true);

  constructor(
    private customOperationService: CustomOperationService
  ) { }

  ngAfterViewInit(): void {
    this.isDisabled$ = this.layout.canSubmit().pipe(
      map(invert),
    );
  }

  onSubmit(): void {
    this.customOperationService
      .run(this.actionData.operation, this.actionData.payload, this.layout.getData())
      .subscribe(() => {
        this.close.emit();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
