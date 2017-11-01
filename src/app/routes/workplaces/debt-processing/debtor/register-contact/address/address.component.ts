import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { AddressService } from '../../../../../../shared/gui-objects/widgets/address/address.service';
import { GridService } from '../../../../../../shared/components/grid/grid.service';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-register-contact-address-grid',
  templateUrl: 'address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressGridComponent implements OnInit {
  @Input() entityType: number;
  @Input() entityId: number;

  columns: IGridColumn[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_ADDRESS_TYPE },
    { prop: 'fullAddress', minWidth: 500 },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_STATUS },
    { prop: 'isResidence', maxWidth: 90, type: 'boolean', renderer: 'checkboxRenderer' },
    { prop: 'comment' },
  ];

  addresses = [];

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => this.columns = this.gridService.setRenderers(columns));

    this.addressService.fetchAll(this.entityType, this.entityId).subscribe(addresses => {
      this.addresses = addresses;
      this.cdRef.markForCheck();
    });
  }

  onSelect(): void {

  }

  onDoubleClick(): void {

  }
}
