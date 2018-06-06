import { ChangeDetectionStrategy, Component, Output, EventEmitter, ViewChild, OnInit, Input } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import {
  IDynamicLayoutConfig, DynamicLayoutControlType, DynamicLayoutItemType
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { TranslateService } from '@ngx-translate/core';

import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-letter-generation-result',
  templateUrl: './result-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterGenerationResultComponent implements OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

  @Input() letterGuid: string;
  @Input() reportGuid: string;

  @Output() close = new EventEmitter<ICloseAction>();

  config: IDynamicLayoutConfig;

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.config = {
      key: 'mass/letter/result',
      items: [
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.MULTISELECT,
          label: 'widgets.mass.letter.dialog.resultType',
          name: 'resultType',
          options: [
            ...(
              this.letterGuid
                ? [{
                  label: this.translateService.instant('widgets.mass.letter.dialog.fileWithLetters'),
                  value: this.letterGuid
                }]
                : []
            ),
            ...(
              this.reportGuid
                ? [{
                  label: this.translateService.instant('widgets.mass.letter.dialog.register'),
                  value: this.reportGuid
                }]
                : []
            )
          ]
        }
      ]
    };
  }

  get tempFileGuid(): string {
    return this.letterGuid || this.reportGuid;
  }

  get canSubmit(): boolean {
    const { resultType } = this.layout.getData();
    return resultType && resultType.length;
  }

  onSubmit(): void {
    const { resultType } = this.layout.getData();
    resultType.forEach(guid => {
      this.downloader.name = `${guid}.xlsx`;
      this.downloader.url = `/tempFile/${guid}`;
      this.downloader.download();
    });
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
