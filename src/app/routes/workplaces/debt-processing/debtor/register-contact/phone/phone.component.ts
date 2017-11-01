import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPhone } from '../../../../../../shared/gui-objects/widgets/phone/phone.interface';
import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { PhoneService } from '../../../../../../shared/gui-objects/widgets/phone/phone.service';
import { RegisterContactService } from '../register-contact.service';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { doOnceIf } from '../../../../../../core/utils/helpers';

@Component({
  selector: 'app-register-contact-phone-grid',
  templateUrl: 'phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneGridComponent implements OnInit {
  @Input() entityType: number;
  @Input() entityId: number;
  @Input() debtId: number;
  @Output() action = new EventEmitter<number>();

  columns: IGridColumn[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_PHONE_TYPE },
    { prop: 'phone', renderer: 'phoneRenderer' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
    { prop: 'comment' },
  ];

  phones: IPhone[];

  private _selectedPhoneId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private phoneService: PhoneService,
    private gridService: GridService,
    private registerContactService: RegisterContactService,
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

  get canRegisterSelectedPhone$(): Observable<boolean> {
    return this.registerContactService.canRegisterPhone$(this.selectedPhone, this.debtId);
  }

  get selectedPhoneId(): number {
    return this._selectedPhoneId;
  }

  get selectedPhone(): IPhone {
    return (this.phones || []).find(phone => phone.id === this._selectedPhoneId);
  }

  onSelect(phone: IPhone): void {
    this._selectedPhoneId = phone.id;
  }

  onDoubleClick(phone: IPhone): void {
    this._selectedPhoneId = phone.id;
    doOnceIf(this.canRegisterSelectedPhone$, () => this.action.emit(this._selectedPhoneId));
  }
}
