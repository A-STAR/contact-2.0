import {
  ChangeDetectionStrategy, Component, OnInit, Input, Output,
  EventEmitter, ViewChild, ChangeDetectorRef
} from '@angular/core';

import { ICloseAction, IGridAction, IGridActionSingleSelection } from '@app/shared/components/action-grid/action-grid.interface';

import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

@Component({
  selector: 'app-mass-letter-export',
  templateUrl: './letter-export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterExportComponent implements OnInit {
  @ViewChild(DownloaderComponent) downloader: DownloaderComponent;

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const { debtId, contactId, messageTemplate } = (this.actionData.payload as IGridActionSingleSelection).data;
    this.downloader.fallbackName = messageTemplate;
    this.downloader.url =
      `/debts/${debtId}/letter/${contactId}/file?callCenter=${this.actionData.actionData.callCenter ? 1 : 0}`;
    this.downloader.download();
    this.cdRef.markForCheck();
    this.close.emit({ refresh: false });
  }
}
