import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-register-contact-phone-grid',
  templateUrl: 'phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneGridComponent {
  columns: IGridColumn[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_PHONE_TYPE },
    { prop: 'phone' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
    { prop: 'comment' },
  ];

  phones = [];

  onDoubleClick(): void {

  }
}
