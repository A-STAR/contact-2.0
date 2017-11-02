import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild
} from '@angular/core';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { IPledger } from '../../pledger/pledger.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { PledgeService } from '../../pledge/pledge.service';
import { PledgerService } from '../../pledger/pledger.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';
import { GridComponent } from '../../../../components/grid/grid.component';

import { parseStringValueAttrs } from '../../../../../core/utils';

@Component({
  selector: 'app-pledger-grid',
  templateUrl: './pledger-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgerGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() searchParams: any;
  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IPledger>();

  columns: Array<IGridColumn> = null;

  dialog: string;
  gridStyles = { height: '500px' };
  persons: Array<IPledger> = [];

  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgerService: PledgerService,
    private pledgeService: PledgeService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
  ) {
    super();
  }

  ngOnInit(): void {
    const attrConstant = this.pledgerService.getAttributeConstant(this.searchParams.typeCode);
    this.userConstantsService.get(attrConstant)
      .flatMap(strAttributeList => {
        const addColumns = parseStringValueAttrs(<string>strAttributeList.valueS)
          .map(attr => ({ prop: attr, type: 'string' }));
        const columns: IGridColumn[] = this.creatateColumns(this.searchParams.typeCode);
        return this.gridService.setAllRenderers(columns.concat(addColumns as IGridColumn[]));
      })
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = this.pledgeService.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch(this.searchParams);
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.pledgers.gen.plural').dispatch();
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

  onSelect(): void {
    this.select.emit(this.selectedPerson);
    this.close.emit();
  }

  get hasSelection(): boolean {
    return this.grid && this.grid.hasSingleSelection;
  }

  get selectedPerson(): IPledger {
    return this.grid.selected.length ? this.grid.selected[0] : null;
  }

  private fetch(searchParams: object = {}): void {
    const filter = this.pledgerService.makeFilter(searchParams, this.columns);
    const params = { sorters: [{ colId: 'lastName', sort: 'asc' }] };
    this.pledgerService.fetchAll(filter, params)
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

  private getPersonColumns(): IGridColumn[] {
    return [
      { prop: 'id', minWidth: 50, maxWidth: 80, type: 'number' },
      { prop: 'lastName', type: 'string' },
      { prop: 'firstName', type: 'string' },
      { prop: 'middleName', type: 'string' },
      { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, type: 'number' },
      { prop: 'birthDate', maxWidth: 130, renderer: 'dateRenderer', type: 'date' },
      { prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER, type: 'number' },
      { prop: 'passportNumber', type: 'string' },
    ];
  }

  private getDefaultColumns(): IGridColumn[] {
    return [
      { prop: 'id', minWidth: 50, maxWidth: 80, type: 'number' },
      { prop: 'lastName', type: 'string' },
      { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, type: 'number' },
    ];
  }

  private creatateColumns(typeCode: number): IGridColumn[] {
    return this.pledgerService.isPerson(typeCode) ? this.getPersonColumns() : this.getDefaultColumns();
  }
}
