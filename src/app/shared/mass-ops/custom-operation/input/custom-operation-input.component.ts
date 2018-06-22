import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { ICustomActionData, ICustomOperationParams } from '../custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { FrameService } from '@app/core/frame/frame.service';

import { CustomOperationParamsComponent } from '../params/custom-operation-params.component';
import { ConfigService } from '@app/core/config/config.service';

@Component({
  selector: 'app-custom-operation-input',
  templateUrl: './custom-operation-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationInputComponent implements OnInit {
  @ViewChild(CustomOperationParamsComponent) params: CustomOperationParamsComponent;

  @Input() id: number;
  @Input() key: string;
  @Input() inputParams: ICustomOperationParams[];

  @Output() submit = new EventEmitter<ICustomActionData>();
  @Output() close = new EventEmitter<ICloseAction>();

  config: IDynamicLayoutConfig;

  constructor(
    private configService: ConfigService,
    private customOperationService: CustomOperationService,
    private frameService: FrameService,
  ) {}

  ngOnInit(): void {
    this.config = this.customOperationService.getActionInputParamsConfig(this.key, this.inputParams);
  }

  get isThirdPartyOperation(): boolean {
    return !!this.configService.getThirdPartyOperationUrl(this.id);
  }

  get canSubmit(): boolean {
    return this.params && this.params.canSubmit;
  }

  onSubmit(): void {
    if (this.isThirdPartyOperation) {
      this.frameService
        .sendMessage(this.params.target(), this.id, 'data')
        .subscribe(data => this.submit.emit(data));
    } else {
      this.submit.emit(this.params.layout.getData());
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
