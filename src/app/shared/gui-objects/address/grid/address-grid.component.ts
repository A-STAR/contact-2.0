import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';

import { IAddress } from '../address.interface';

import { AddressGridService } from './address-grid.service';

@Component({
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridComponent implements OnInit {
  columns = [];

  private _addresses: Array<IAddress>;
  private _key: string;

  constructor(
    private addressGridService: AddressGridService,
    private changeDetectorRef: ChangeDetectorRef,
    private injector: Injector,
  ) {
    this._key = this.injector.get('key');
  }

  ngOnInit(): void {
    // TODO(d.maltsev): pass person id
    this.addressGridService.fetch(1)
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
