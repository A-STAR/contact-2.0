import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICustomActionData } from '../custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { invert } from '@app/core/utils';

@Component({
  selector: 'app-custom-operation-input',
  templateUrl: './custom-operation-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationInputComponent implements AfterViewInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() config: IDynamicLayoutConfig;

  @Output() submit = new EventEmitter<ICustomActionData>();
  @Output() close = new EventEmitter<ICloseAction>();

  isDisabled$ = of(true);

  ngAfterViewInit(): void {
    this.isDisabled$ = this.layout.canSubmit().pipe(
      map(invert),
    );
  }

  onSubmit(): void {
    this.submit.emit(this.layout.getData());
  }

  onClose(): void {
    this.close.emit();
  }
}
