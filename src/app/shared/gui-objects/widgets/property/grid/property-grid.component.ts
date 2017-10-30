import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IProperty } from '../property.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PropertyService } from '../property.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-property-grid',
  templateUrl: './property-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedProperty$ = new BehaviorSubject<IProperty>(null);

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'isConfirmed', renderer: 'checkboxRenderer' },
    { prop: 'comment' }
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.propertyService.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedProperty$.value),
      enabled: Observable.combineLatest(
        this.propertyService.canEdit$,
        this.selectedProperty$
      ).map(([canEdit, selectedProperty]) => !!canEdit && !!selectedProperty)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeProperty'),
      enabled: Observable.combineLatest(
        this.propertyService.canDelete$,
        this.selectedProperty$
      ).map(([canDelete, selectedProperty]) => !!canDelete && !!selectedProperty),
    },
  ];

  dialog: 'delete';

  private _propertyList: Array<IProperty> = [];

  private personId = (this.route.params as any).value.personId || null;

  private busSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private propertyService: PropertyService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
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

    this.viewPermissionSubscription = this.propertyService.canView$
      .subscribe(hasViewPermission => {
        if (hasViewPermission) {
          this.fetch();
        } else {
          this.clear();
          this.notificationsService.error('errors.default.read.403').entity('entities.property.gen.plural').dispatch();
        }
      });

    this.busSubscription = this.messageBusService
      .select(PropertyService.MESSAGE_PROPERTY_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedProperty$.next(this.selectedProperty);
      });

    this.selectedProperty$.subscribe(property =>
      this.messageBusService.dispatch(PropertyService.MESSAGE_PROPERTY_SELECTED, null, property)
    );
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get propertyList(): Array<IProperty> {
    return this._propertyList;
  }

  get selectedProperty(): IProperty {
    return (this._propertyList || [])
      .find(property => this.selectedProperty$.value && property.id === this.selectedProperty$.value.id);
  }

  get selection(): Array<IProperty> {
    const selectedProperty = this.selectedProperty;
    return selectedProperty ? [ selectedProperty ] : [];
  }

  onSelect(property: IProperty): void {
    this.selectedProperty$.next(property);
  }

  onEdit(property: IProperty): void {
    this.router.navigate([ `${this.router.url}/property/${property.id}` ]);
  }

  onRemove(): void {
    const { id: propertyId } = this.selectedProperty;
    this.propertyService.delete(this.personId, propertyId)
      .subscribe(() => {
        this.setDialog(null);
        this.selectedProperty$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/property/create` ]);
  }

  private fetch(): void {
    this.propertyService.fetchAll(this.personId).subscribe(propertyList => {
      this._propertyList = propertyList;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._propertyList = [];
    this.cdRef.markForCheck();
  }
}
