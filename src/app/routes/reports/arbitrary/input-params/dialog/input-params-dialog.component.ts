import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';

import { InputParamsCardComponent } from '../card/params-card.component';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

@Component({
  selector: 'app-arbitrary-input-params-dialog',
  templateUrl: './input-params-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputParamsDialogComponent {

  @Input() reportId: number;
  @Input() reportName: string;

  @Output() close = new EventEmitter<boolean>();

  @ViewChild(InputParamsCardComponent) card: InputParamsCardComponent;
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

  get canSubmit(): boolean {
    return this.card && this.card.canSubmit;
  }

  get exportUrl(): string {
    return `/reports/${this.reportId}/form`;
  }

  onSubmit(): void {
    this.downloader.download({ params: this.card.inputParamsValues });
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
