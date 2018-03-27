import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IPledgor } from '../../pledgor/pledgor.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { PledgeService } from '../../pledge.service';
import { PledgorService } from '../../pledgor/pledgor.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';
import { parseStringValueAttrs, addGridLabel, isEmpty } from '@app/core/utils';
import { DateRendererComponent } from '@app/shared/components/grids/renderers/date/date.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-pledgor-grid',
  templateUrl: './pledgor-grid.component.html',
})
export class PledgorGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input() searchParams: any;

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IPledgor>();

  columns: ISimpleGridColumn<IPledgor>[] = null;

  dialog: string;
  persons: Array<IPledgor> = [];
  selection: IPledgor;

  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgorService: PledgorService,
    private pledgeService: PledgeService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
  ) {
    super();
  }

  ngOnInit(): void {
    const attrConstant = this.pledgorService.getAttributeConstant(this.searchParams.typeCode);
    this.userConstantsService.get(attrConstant)
      .pipe(first())
      .subscribe(strAttributeList => {
        const addColumns = parseStringValueAttrs(<string>strAttributeList.valueS)
          .map(attr => ({ prop: attr, type: 'string' }))
          .map(addGridLabel('widgets.pledgor.grid'));
        this.columns = [
          ...this.creatateColumns(this.searchParams.typeCode),
          ...addColumns,
        ];
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = this.pledgeService.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch(this.searchParams);
        } else {
          this.notificationsService.permissionError().entity('entities.pledgors.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
  }

  onClose(): void {
    this.close.emit();
  }

  onDblClick(person: IPledgor): void {
    this.select.emit(person);
    this.close.emit();
  }

  onSelect(persons: IPledgor[]): void {
    const person = isEmpty(persons)
      ? null
      : persons[0];
    this.selection = person;
    this.cdRef.markForCheck();
  }

  private fetch(searchParams: object = {}): void {
    const filter = this.pledgorService.makeFilter(searchParams, this.columns as any);
    const params = { sorters: [{ colId: 'lastName', sort: 'asc' }] };
    this.pledgorService.fetchAll(filter, params)
      .subscribe(response => {
        const { data: persons } = response;
        this.persons = persons ? [...persons] : [];
        if (!this.persons.length) {
          this.setDialog('infoNotFound');
        }
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.persons = [];
    this.cdRef.markForCheck();
  }

  private getPersonColumns(): ISimpleGridColumn<IPledgor>[] {
    return [
      { prop: 'id', minWidth: 50, maxWidth: 80, type: 'number' },
      { prop: 'lastName', type: 'string' },
      { prop: 'firstName', type: 'string' },
      { prop: 'middleName', type: 'string' },
      { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, type: 'number' },
      { prop: 'birthDate', maxWidth: 130, renderer: DateRendererComponent, type: 'date' },
      { prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER, type: 'number' },
      { prop: 'passportNumber', type: 'string' },
    ].map(addGridLabel('widgets.pledgor.grid'));
  }

  private getDefaultColumns(): ISimpleGridColumn<IPledgor>[] {
    return [
      { prop: 'id', minWidth: 50, maxWidth: 80 },
      { prop: 'lastName' },
      { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    ].map(addGridLabel('widgets.pledgor.grid'));
  }

  private creatateColumns(typeCode: number): ISimpleGridColumn<IPledgor>[] {
    return this.pledgorService.isPerson(typeCode) ? this.getPersonColumns() : this.getDefaultColumns();
  }
}
