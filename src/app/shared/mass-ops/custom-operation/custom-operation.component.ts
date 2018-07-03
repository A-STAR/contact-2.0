import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { ICustomActionData, ICustomOperationParams } from './custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

@Component({
  selector: 'app-mass-custom-operation',
  templateUrl: './custom-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationComponent implements OnInit {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

  result: ICustomActionData;

  inputParams: ICustomOperationParams[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private customOperationService: CustomOperationService
  ) { }

  ngOnInit(): void {
    this.customOperationService.getOperationParams(this.actionData)
      .subscribe(params => {
        this.initInputParams(params);
        this.cdRef.markForCheck();
      });
  }

  get inputParamsExists(): boolean {
    return this.inputParams && !!this.inputParams.length;
  }

  onSubmit(data: ICustomActionData): void {
    this.run(data);
  }

  onClose(): void {
    this.close.emit();
  }

  private initInputParams(params: ICustomOperationParams[]): void {
    if (params.length) {
      this.inputParams = params;
    } else {
      this.run();
    }
  }

  private run(data: ICustomActionData = {}): void {
    this.customOperationService
      .run(this.actionData, this.inputParams, data)
      .subscribe(result => {
        if (result.data) {
          this.onOperationResult(result);
        } else {
          this.close.emit();
        }
        this.cdRef.markForCheck();
      });
  }

  private onOperationResult(result: ICustomActionData): void {
    if (this.actionData.outputConfig) {
      this.result = result.data;
    } else {
      const data = result.data[0];
      if (data.excelFileGuid) {
        this.downloader.url = `/tempFiles/${data.excelFileGuid}`;
        this.downloader.download();
      }
      this.customOperationService.showResultMessage(data);
      this.close.emit();
    }
  }
}
