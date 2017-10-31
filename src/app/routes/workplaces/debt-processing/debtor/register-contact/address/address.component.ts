import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-register-contact-address-grid',
  templateUrl: 'address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressGridComponent {
  columns: IGridColumn[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_ADDRESS_TYPE },
    { prop: 'fullAddress' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_STATUS },
    { prop: 'isResidence', maxWidth: 90, type: 'boolean', renderer: 'checkboxRenderer' },
    { prop: 'comment' },
  ];

  addresses = [];

  onDoubleClick(): void {

  }
}
