import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
  Input, OnInit, OnDestroy, Output, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IPledgerProperty } from '../../pledger-property/pledger-property.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { PledgeService } from '../../pledge/pledge.service';
import { PledgerPropertyService } from '../../pledger-property/pledger-property.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';
import { GridComponent } from '../../../../components/grid/grid.component';

@Component({
  selector: 'app-pledger-property-grid',
  templateUrl: './pledger-property-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PledgerPropertyGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  @ViewChild(GridComponent) grid: GridComponent;

  @Input() searchParams: any;
  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IPledgerProperty>();

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'isConfirmed', renderer: 'checkboxRenderer' },
    { prop: 'comment' }
  ];

  dialog: string;
  gridStyles = { height: '500px' };
  propertyList: Array<IPledgerProperty> = [];

  private personId;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgerPropertyService: PledgerPropertyService,
    private pledgeService: PledgeService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .take(1)
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.canViewSubscription = Observable.combineLatest(
      this.pledgeService.canView$
    ).subscribe(([ hasPermission ]) => {
      this.personId = this.searchParams.personId;

      if (hasPermission) {
        this.fetch();
      } else {
        this.notificationsService.error('errors.default.read.403').entity('entities.property.gen.plural').dispatch();
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

  get selectedProperty(): IPledgerProperty {
    return this.grid.selected.length ? this.grid.selected[0] : null;
  }

  private fetch(searchParams: object = {}): void {
    this.pledgerPropertyService.fetchAll(this.personId).subscribe(propertyList => {
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
