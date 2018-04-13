import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { AddressService } from '../address.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent extends DialogFunctions implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<void>();

  dialog: string;

  entityType = { entityType : 'persons' };

  constructor(
    private addressService: AddressService
  ) {
      super();
  }

  ngOnInit(): void {
    this.addressService.getCoordsByPerson(this.actionData.payload).pipe(
      // map(  )

    );
  }

}
