import {
  Component,
  Input
} from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-debtor-general-information-phones',
  templateUrl: './debtor-general-information-phones.component.html',
})
export class DebtorGeneralInformationPhonesComponent {

  @Input() rows;

  columns: Array<IGridColumn> = [
    { prop: 'type' },
    { prop: 'number' },
    { prop: 'status' },
    { prop: 'lastCall' },
    { prop: 'contactPerson' },
    { prop: 'comment' },
    { prop: 'region' },
    { prop: 'active' },
    { prop: 'qualityCode' },
    { prop: 'numberExists' },
    { prop: 'verified' },
    { prop: 'blockingDate' },
    { prop: 'blockingReason' },
  ];
}
