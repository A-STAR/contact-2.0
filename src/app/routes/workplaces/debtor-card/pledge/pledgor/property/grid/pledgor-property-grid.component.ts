import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  Input, OnInit, OnDestroy, Output, ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import { IPledgorProperty } from '../pledgor-property.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';

import { PledgeService } from '../../../pledge.service';
import { PledgorPropertyService } from '../pledgor-property.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-pledgor-property-grid',
  templateUrl: './pledgor-property-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgorPropertyGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  @ViewChild(GridComponent) grid: GridComponent;

  @Input() searchParams: any;
  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IPledgorProperty>();

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'isConfirmed', renderer: 'checkboxRenderer' },
    { prop: 'comment' }
  ];

  dialog: string;
  gridStyles = { height: '350px' };
  propertyList: Array<IPledgorProperty> = [];

  private personId;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgorPropertyService: PledgorPropertyService,
    private pledgeService: PledgeService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.canViewSubscription = combineLatest(
      this.pledgeService.canView$
    ).subscribe(([ hasPermission ]) => {
      this.personId = this.searchParams.personId;

      if (hasPermission) {
        this.fetch();
      } else {
        this.notificationsService.permissionError().entity('entities.property.gen.plural').dispatch();
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
    this.select.emit(this.selectedProperty);
    this.close.emit();
  }

  get hasSelection(): boolean {
    return this.grid && this.grid.hasSingleSelection;
  }

  get selectedProperty(): IPledgorProperty {
    return this.grid.selected.length ? this.grid.selected[0] : null;
  }

  private fetch(searchParams: object = {}): void {
    this.pledgorPropertyService.fetchAll(this.personId).subscribe(propertyList => {
      this.propertyList = propertyList;
      if (!this.propertyList.length) {
        this.setDialog('infoNotFound');
      }
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this.propertyList = [];
    this.cdRef.markForCheck();
  }
}
