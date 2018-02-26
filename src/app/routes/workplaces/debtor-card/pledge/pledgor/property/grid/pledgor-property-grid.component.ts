import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IPledgorProperty } from '../pledgor-property.interface';

import { PledgeService } from '../../../pledge.service';
import { PledgorPropertyService } from '../pledgor-property.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-pledgor-property-grid',
  templateUrl: './pledgor-property-grid.component.html',
})
export class PledgorPropertyGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input() searchParams: any;
  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IPledgorProperty>();

  columns: ISimpleGridColumn<IPledgorProperty>[] = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'isConfirmed', renderer: 'checkboxRenderer' },
    { prop: 'comment' }
  ].map(addGridLabel('widgets.property'));

  dialog: string;
  gridStyles = { height: '350px' };
  propertyList: Array<IPledgorProperty> = [];
  selection: IPledgorProperty;

  private personId;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgorPropertyService: PledgorPropertyService,
    private pledgeService: PledgeService,
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
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

  onSelect(properties: IPledgorProperty[]): void {
    const property = isEmpty(properties)
      ? null
      : properties[0];
    this.selection = property;
    this.select.emit(property);
    this.close.emit();
    this.cdRef.markForCheck();
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
