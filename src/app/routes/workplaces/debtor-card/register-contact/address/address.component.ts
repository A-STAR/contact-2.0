import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { mergeMap, first, filter } from 'rxjs/operators';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { AddressService } from '@app/routes/workplaces/core/address/address.service';
import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

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

  private selectedAddress$ = new BehaviorSubject<IAddress>(null);

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

  readonly canRegisterSelectedAddress$: Observable<boolean> = this.selectedAddress$.pipe(
    mergeMap(address => this.debtorService.canRegisterAddressVisit$(address)),
  );

  onSelect(addresses: IAddress[]): void {
    this.selectedAddress$.next(addresses[0]);
    this.cdRef.markForCheck();
  }

  onDoubleClick(address: IAddress): void {
    this.selectedAddress$.next(address);
    this.onSubmit();
  }

  onSubmit(): void {
    this.canRegisterSelectedAddress$
      .pipe(
        first(),
        filter(Boolean),
        mergeMap(() => this.selectedAddress$),
      )
      .subscribe(address => this.action.emit(address.id));
  }
}
