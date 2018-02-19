import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IGuarantor } from '../../guarantee.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';

import { GuarantorService } from '../guarantor.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';
import { parseStringValueAttrs } from '@app/core/utils';

@Component({
  selector: 'app-guarantor-grid',
  templateUrl: './guarantor-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuarantorGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() searchParams: any;
  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IGuarantor>();

  columns: Array<IGridColumn> = null;

  dialog: string;
  gridStyles = { height: '500px' };
  persons: Array<IGuarantor> = [];

  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guarantorService: GuarantorService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    const attrConstant = this.guarantorService.getAttributeConstant(this.searchParams.typeCode);
    this.userConstantsService.get(attrConstant)
      .flatMap(strAttributeList => {
        const addColumns = parseStringValueAttrs(<string>strAttributeList.valueS)
          .map(attr => ({ prop: attr, type: 'string' }));
        const baseControls: IGridColumn[] = [
          { prop: 'id', minWidth: 50, maxWidth: 80, type: 'number' },
          { prop: 'lastName', type: 'string' },
        ];
        const columns: IGridColumn[] = this.searchParams.typeCode === 1
            ? [
                ...baseControls,
                { prop: 'firstName', type: 'string' },
                { prop: 'middleName', type: 'string' },
                { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, type: 'number' },
                { prop: 'birthDate', maxWidth: 130, renderer: 'dateRenderer', type: 'date' },
                { prop: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER, type: 'number' },
                { prop: 'passportNumber', type: 'string' },
              ]
            : [
                ...baseControls,
                { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, type: 'number' },
              ];

        return this.gridService.setAllRenderers(columns.concat(addColumns as IGridColumn[]));
      })
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch(this.searchParams);
        } else {
          this.notificationsService.permissionError().entity('entities.guarantors.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.canViewSubscription) {
      this.canViewSubscription.unsubscribe();
    }
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
          this.setDialog('infoNotFound');
        }
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.persons = [];
    this.cdRef.markForCheck();
  }

}
