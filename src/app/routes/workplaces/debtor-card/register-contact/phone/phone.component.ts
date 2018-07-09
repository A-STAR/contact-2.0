import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { mergeMap, first, filter } from 'rxjs/operators';

import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { PhoneService } from '@app/routes/workplaces/core/phone/phone.service';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addGridLabel } from '@app/core/utils';

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

  private selectedPhone$ = new BehaviorSubject<IPhone>(null);

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

  readonly canRegisterSelectedPhone$: Observable<boolean> = this.selectedPhone$.pipe(
    mergeMap(phone => this.debtorService.canRegisterIncomingCall$(phone)),
  );

  onSelect(phones: IPhone[]): void {
    this.selectedPhone$.next(phones[0]);
    this.cdRef.markForCheck();
  }

  onDoubleClick(phone: IPhone): void {
    this.selectedPhone$.next(phone);
    this.onSubmit();
  }

  onSubmit(): void {
    this.canRegisterSelectedPhone$
      .pipe(
        first(),
        filter(Boolean),
        mergeMap(() => this.selectedPhone$),
      )
      .subscribe(phone => this.action.emit(phone.id));
  }
}
