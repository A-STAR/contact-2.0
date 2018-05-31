import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { first } from 'rxjs/operators/first';
import { Observable } from 'rxjs/Observable';

import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { PhoneService } from '@app/routes/workplaces/core/phone/phone.service';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addGridLabel, doOnceIf, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-register-contact-phone-grid',
  templateUrl: 'phone.component.html',
})
export class PhoneGridComponent implements OnInit {
  @Input() entityType: number;
  @Input() entityId: number;
  @Output() action = new EventEmitter<number>();

  columns: ISimpleGridColumn<IPhone>[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_PHONE_TYPE },
    { prop: 'phone' /*, renderer: 'phoneRenderer' */ },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
    { prop: 'comment' },
  ].map(addGridLabel('debtor.information.phone.grid'));

  phones: IPhone[];
  selectedPhone: IPhone;

  private selectedPhoneId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private phoneService: PhoneService,
  ) {}

  ngOnInit(): void {
    this.phoneService.fetchAll(this.entityType, this.entityId, false)
    .pipe(first())
    .subscribe(phones => {
      this.phones = phones.filter(phone => !phone.isInactive);
      this.cdRef.markForCheck();
    });
  }

  readonly canRegisterSelectedPhone$: Observable<boolean> = this.debtorService.canRegisterIncomingCall$(this.selectedPhone);

  onSelect(phones: IPhone[]): void {
    this.selectedPhoneId = isEmpty(phones)
      ? null
      : phones[0].id;
    this.selectedPhone = phones && phones.length && phones[0];
    this.cdRef.markForCheck();
  }

  onDoubleClick(phone: IPhone): void {
    this.selectedPhone = phone;
    this.selectedPhoneId = phone.id;
    doOnceIf(this.canRegisterSelectedPhone$, () => this.action.emit(this.selectedPhoneId));
  }

  onSubmit(): void {
    doOnceIf(this.canRegisterSelectedPhone$, () => this.action.emit(this.selectedPhoneId));
  }
}
