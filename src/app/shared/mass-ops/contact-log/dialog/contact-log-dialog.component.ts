import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';

@Component({
  selector: 'app-contact-log-dialog',
  templateUrl: 'contact-log-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactLogDialogComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<void>();

  personId: number;

  constructor(
    private actionGridService: ActionGridService
  ) {}

  ngOnInit(): void {
    this.personId = this.actionGridService.buildRequest(this.actionData.payload).personId;
  }

  onClose(): void {
    this.close.emit();
  }
}
