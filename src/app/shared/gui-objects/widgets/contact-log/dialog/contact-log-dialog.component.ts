import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { IGridActionParams } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';

@Component({
  selector: 'app-contact-log-dialog',
  templateUrl: 'contact-log-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactLogDialogComponent implements OnInit {
  @Input() actionData: IGridActionParams;
  @Output() close = new EventEmitter<void>();

  personId: number;

  constructor(
    private actionGridFilterService: ActionGridFilterService
  ) {}

  ngOnInit(): void {
    this.personId = this.actionGridFilterService.buildRequest(this.actionData.payload).personId;
  }

  onClose(): void {
    this.close.emit();
  }
}
