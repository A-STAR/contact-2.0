import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { AddressService } from '@app/routes/workplaces/core/address/address.service';
import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, doOnceIf, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-register-contact-address-grid',
  templateUrl: 'address.component.html',
})
export class AddressGridComponent implements OnInit {
  @Input() entityType: number;
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
  selectedAddress: IAddress;
  private selectedAddressId: number;

  constructor(
    private addressService: AddressService,
    private debtorService: DebtorService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.addressService.fetchAll(this.entityType, this.entityId, false).subscribe(addresses => {
      this.addresses = addresses.filter(address => !address.isInactive);
      this.cdRef.markForCheck();
    });
  }

  readonly canRegisterSelectedAddress$: Observable<boolean> = this.debtorService.canRegisterAddressVisit$(this.selectedAddress);

  onSelect(addresses: IAddress[]): void {
    this.selectedAddressId = isEmpty(addresses)
      ? null
      : addresses[0].id;
    this.selectedAddress = addresses[0];
    this.cdRef.markForCheck();
  }

  onDoubleClick(address: IAddress): void {
    this.selectedAddressId = address.id;
    this.selectedAddress = address;
    doOnceIf(this.canRegisterSelectedAddress$, () => this.action.emit(this.selectedAddressId));
  }

  onSubmit(): void {
    doOnceIf(this.canRegisterSelectedAddress$, () => this.action.emit(this.selectedAddressId));
  }
}
