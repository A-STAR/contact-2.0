import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { IGridAction, ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';

@Component({
  selector: 'app-open-register-contact',
  templateUrl: './open-register-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenRegisterContactComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  entityId: number;

  constructor(
    private actionGridFilterService: ActionGridFilterService
  ) { }

  ngOnInit(): void {
    this.entityId = Number(this.actionGridFilterService.getAddOption(this.actionData, 'entityId', 0));
    const { debtId, personId } = this.actionGridFilterService.buildRequest(this.actionData.payload);
  }

}
