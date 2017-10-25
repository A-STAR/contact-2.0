import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { IGuarantor } from '../../guarantee/guarantee.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { GuarantorService } from '../../guarantor/guarantor.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { DialogFunctions } from '../../../../../core/dialog';
import { GridComponent } from '../../../../components/grid/grid.component';

@Component({
  selector: 'app-guarantor-grid',
  templateUrl: './guarantor-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuarantorGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() searchParams: object;
  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IGuarantor>();

  columns: Array<IGridColumn> = [
    { prop: 'id', width: 70, minWidth: 40, type: 'number' },
    { prop: 'lastName', type: 'string' },
    { prop: 'firstName', type: 'string' },
    { prop: 'middleName', type: 'string' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, type: 'number' },
    { prop: 'birthDate', maxWidth: 130, renderer: 'dateRenderer', type: 'date' },
    { prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER, type: 'number' },
    { prop: 'passportNumber', type: 'string' },
    { prop: 'stringValue1', type: 'string' },
  ];

  dialog: string;
  gridStyles = { height: '500px' };
  persons: Array<IGuarantor> = [];

  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guarantorService: GuarantorService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();

    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch(this.searchParams);
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.employment.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
  }

  onDoubleClick(guarantor: IGuarantor): void {
    this.select.emit(guarantor);
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('GUARANTEE_VIEW');
  }

  get hasSelection(): boolean {
    return this.grid && this.grid.hasSingleSelection;
  }

  private fetch(searchParams: object = {}): void {
    const filter = this.guarantorService.makeFilter(searchParams, this.columns);
    const params = { sorters: [{ colId: 'lastName', sort: 'asc' }] };
    this.guarantorService.fetchAll(filter, params)
      .subscribe(response => {
        const { data: persons } = response;
        this.persons = persons ? [...persons] : [];
        if (!this.persons.length) {
          this.setDialog('infoNoRecords');
        }
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.persons = [];
    this.cdRef.markForCheck();
  }

}
