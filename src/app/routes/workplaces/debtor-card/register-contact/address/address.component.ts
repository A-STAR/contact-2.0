import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IAddress } from '@app/routes/workplaces/shared/address/address.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { AddressService } from '@app/routes/workplaces/shared/address/address.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { DebtService } from '../../../../../core/debt/debt.service';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { doOnceIf } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-register-contact-address-grid',
  templateUrl: 'address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressGridComponent implements OnInit {
  @Input() entityType: number;
  @Input() entityId: number;
  @Output() action = new EventEmitter<number>();

  columns: IGridColumn[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_ADDRESS_TYPE },
    { prop: 'fullAddress', minWidth: 500 },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_STATUS },
    { prop: 'isResidence', maxWidth: 90, type: 'boolean', renderer: 'checkboxRenderer' },
    { prop: 'comment' },
  ];

  addresses: IAddress[];

  private selectedAddressId: number;

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => this.columns = this.gridService.setRenderers(columns));

    this.addressService.fetchAll(this.entityType, this.entityId, false).subscribe(addresses => {
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

  onSelect(address: IAddress): void {
    this.selectedAddressId = address.id;
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
