import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IAddress } from '../address.interface';

import { AddressGridService } from './address-grid.service';

@Component({
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridComponent implements OnInit {
  @Input() personId: number;

  columns = [];

  private _addresses: Array<IAddress>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private addressGridService: AddressGridService,
  ) {}

  ngOnInit(): void {
    this.addressGridService.fetch(this.personId)
      .subscribe(addresses => {
        this._addresses = addresses;
        this.changeDetectorRef.markForCheck();
      });
  }

  get addresses(): Array<IAddress> {
    return this._addresses;
  }

  onDoubleClick(event: any): void {
    //
  }

  onSelect(event: any): void {
    //
  }
}
