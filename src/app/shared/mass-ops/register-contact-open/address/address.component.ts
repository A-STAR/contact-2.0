import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress } from '@app/routes/workplaces/shared/address/address.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { AddressService } from '@app/routes/workplaces/shared/address/address.service';
import { DebtService } from '@app/core/debt/debt.service';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, doOnceIf, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-register-contact-address-grid',
  templateUrl: 'address.component.html',
})
export class AddressGridComponent implements OnInit {
  @Input() entityTypeId: number;
  @Input() entityId: number;
  @Output() action = new EventEmitter<number>();

  columns: ISimpleGridColumn<IAddress>[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_ADDRESS_TYPE },
    { prop: 'fullAddress', minWidth: 500 },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_STATUS },
    { prop: 'isResidence', maxWidth: 90, type: 'boolean', renderer: TickRendererComponent },
    { prop: 'comment' },
  ].map(addGridLabel('debtor.information.address.grid'));

  addresses: IAddress[];

  private selectedAddressId: number;

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
  ) {}

  ngOnInit(): void {
    this.addressService.fetchAll(this.entityTypeId, this.entityId, false).subscribe(addresses => {
      this.addresses = addresses.filter(address => !address.isInactive);
      this.cdRef.markForCheck();
    });
  }

  get canRegisterSelectedAddress$(): Observable<boolean> {
    return this.debtService.canRegisterAddressVisit$(this.selectedAddress);
  }

  get selectedAddress(): IAddress {
    return (this.addresses || []).find(address => address.id === this.selectedAddressId);
  }

  onSelect(addresses: IAddress[]): void {
    this.selectedAddressId = isEmpty(addresses)
      ? null
      : addresses[0].id;
    this.cdRef.markForCheck();
  }

  onDoubleClick(address: IAddress): void {
    this.selectedAddressId = address.id;
    doOnceIf(this.canRegisterSelectedAddress$, () => this.action.emit(this.selectedAddressId));
  }

  onSubmit(): void {
    doOnceIf(this.canRegisterSelectedAddress$, () => this.action.emit(this.selectedAddressId));
  }
}
