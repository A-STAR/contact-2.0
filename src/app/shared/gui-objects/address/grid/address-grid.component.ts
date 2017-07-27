import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress } from '../address.interface';

import { AddressService } from '../address.service';

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
    private guiAddressesService: AddressService,
  ) {}

  ngOnInit(): void {
    this.guiAddressesService.fetch(this.personId)
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
