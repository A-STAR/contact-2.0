import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { DebtService } from '../../../../../core/debt/debt.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { PhoneService } from '@app/routes/workplaces/shared/phone/phone.service';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { doOnceIf } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-register-contact-phone-grid',
  templateUrl: 'phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneGridComponent implements OnInit {
  @Input() entityType: number;
  @Input() entityId: number;
  @Output() action = new EventEmitter<number>();

  columns: IGridColumn[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_PHONE_TYPE },
    { prop: 'phone', renderer: 'phoneRenderer' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
    { prop: 'comment' },
  ];

  phones: IPhone[];

  private selectedPhoneId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private gridService: GridService,
    private phoneService: PhoneService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => this.columns = this.gridService.setRenderers(columns));

    this.phoneService.fetchAll(this.entityType, this.entityId, false).subscribe(phones => {
      this.phones = phones.filter(phone => !phone.isInactive);
      this.cdRef.markForCheck();
    });
  }

  get canRegisterSelectedPhone$(): Observable<boolean> {
    return this.debtService.canRegisterIncomingCall$(this.selectedPhone);
  }

  get selectedPhone(): IPhone {
    return (this.phones || []).find(phone => phone.id === this.selectedPhoneId);
  }

  onSelect(phone: IPhone): void {
    this.selectedPhoneId = phone.id;
    this.cdRef.markForCheck();
  }

  onDoubleClick(phone: IPhone): void {
    this.selectedPhoneId = phone.id;
    doOnceIf(this.canRegisterSelectedPhone$, () => this.action.emit(this.selectedPhoneId));
  }

  onSubmit(): void {
    doOnceIf(this.canRegisterSelectedPhone$, () => this.action.emit(this.selectedPhoneId));
  }
}
