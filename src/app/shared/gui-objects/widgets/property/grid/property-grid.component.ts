import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IProperty } from '../property.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { PropertyService } from '../property.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-property-grid',
  templateUrl: './property-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyGridComponent implements OnDestroy {
  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'propertyTypeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'isConfirmed', renderer: 'checkboxRenderer' },
    { prop: 'comment' }
  ];

  toolbarItems: Array<IToolbarItem> = [
  ];

  private _propertyList: Array<IProperty> = [];

  private personId = (this.route.params as any).value.personId || null;

  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private propertyService: PropertyService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    private route: ActivatedRoute
  ) {

    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.viewPermissionSubscription = this.canView$.subscribe(hasViewPermission => {
      if (hasViewPermission) {
        this.fetch();
      } else {
        this.clear();
        this.notificationsService.error('errors.default.read.403').entity('entities.property.gen.plural').dispatch();
      }
    });
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get propertyList(): Array<IProperty> {
    return this._propertyList;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PROPERTY_VIEW');
  }

  private fetch(): void {
    this.propertyService.fetchAll(this.personId).subscribe(propertyList => {
      this._propertyList = propertyList;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._propertyList = [];
  }
}
