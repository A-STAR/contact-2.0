import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { PhoneService } from '../../../../../../shared/gui-objects/widgets/phone/phone.service';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-register-contact-phone-grid',
  templateUrl: 'phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneGridComponent implements OnInit {
  @Input() entityType: number;
  @Input() entityId: number;

  columns: IGridColumn[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_PHONE_TYPE },
    { prop: 'phone', renderer: 'phoneRenderer' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
    { prop: 'comment' },
  ];

  phones = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private phoneService: PhoneService,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => this.columns = this.gridService.setRenderers(columns));

    this.phoneService.fetchAll(this.entityType, this.entityId).subscribe(phones => {
      this.phones = phones;
      this.cdRef.markForCheck();
    });
  }

  onSelect(): void {

  }

  onDoubleClick(): void {

  }
}
