import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild
} from '@angular/core';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IPledgor } from '../../pledgor/pledgor.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';

import { PledgeService } from '../../pledge.service';
import { PledgorService } from '../../pledgor/pledgor.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';
import { parseStringValueAttrs } from '@app/core/utils';

@Component({
  selector: 'app-pledgor-grid',
  templateUrl: './pledgor-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgorGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() searchParams: any;
  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IPledgor>();

  columns: Array<IGridColumn> = null;

  dialog: string;
  gridStyles = { height: '500px' };
  persons: Array<IPledgor> = [];

  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgorService: PledgorService,
    private pledgeService: PledgeService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
  ) {
    super();
  }

  ngOnInit(): void {
    const attrConstant = this.pledgorService.getAttributeConstant(this.searchParams.typeCode);
    this.userConstantsService.get(attrConstant)
      .flatMap(strAttributeList => {
        const addColumns = parseStringValueAttrs(<string>strAttributeList.valueS)
          .map(attr => ({ prop: attr, type: 'string' }));
        const columns: IGridColumn[] = this.creatateColumns(this.searchParams.typeCode);
        return this.gridService.setAllRenderers(columns.concat(addColumns as IGridColumn[]));
      })
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
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

  onSelect(): void {
    this.select.emit(this.selectedPerson);
    this.close.emit();
  }

  get hasSelection(): boolean {
    return this.grid && this.grid.hasSingleSelection;
  }

  get selectedPerson(): IPledgor {
    return this.grid.selected.length ? this.grid.selected[0] : null;
  }

  private fetch(searchParams: object = {}): void {
    const filter = this.pledgorService.makeFilter(searchParams, this.columns);
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
    return this.pledgorService.isPerson(typeCode) ? this.getPersonColumns() : this.getDefaultColumns();
  }
}
