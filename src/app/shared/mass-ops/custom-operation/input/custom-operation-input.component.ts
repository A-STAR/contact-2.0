import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICustomActionData } from '../custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import { IMetadataActionParam } from '@app/core/metadata/metadata.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { invert } from '@app/core/utils';

@Component({
  selector: 'app-custom-operation-input',
  templateUrl: './custom-operation-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationInputComponent implements OnInit, AfterViewInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() key: string;
  @Input() inputParams: IMetadataActionParam[];

  @Output() submit = new EventEmitter<ICustomActionData>();
  @Output() close = new EventEmitter<ICloseAction>();

  isDisabled$ = of(true);

  config: IDynamicLayoutConfig;

  constructor(
    private customOperationService: CustomOperationService
  ) {}

  ngOnInit(): void {
    this.config = this.customOperationService.getActionParamsConfig(this.key, this.inputParams, true);
  }

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
