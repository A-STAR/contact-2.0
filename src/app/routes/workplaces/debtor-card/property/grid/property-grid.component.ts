import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IProperty } from '@app/routes/workplaces/core/property/property.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { PropertyService } from '@app/routes/workplaces/core/property/property.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';
import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-property-grid',
  templateUrl: './property-grid.component.html',
})
export class PropertyGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input() personId: number;

  private selectedProperty$ = new BehaviorSubject<IProperty>(null);

  columns: ISimpleGridColumn<IProperty>[] = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE },
    { prop: 'isConfirmed', renderer: TickRendererComponent },
    { prop: 'comment' }
  ].map(addGridLabel('widgets.property.grid'));

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: this.propertyService.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      action: () => this.onEdit(this.selectedProperty$.value),
      enabled: combineLatestAnd([
        this.propertyService.canEdit$,
        this.selectedProperty$.map(o => !!o)
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      action: () => this.setDialog('removeProperty'),
      enabled: combineLatestAnd([
        this.propertyService.canDelete$,
        this.selectedProperty$.map(o => !!o)
      ])
    },
  ];

  dialog: 'delete';

  private _propertyList: IProperty[] = [];

  private busSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private propertyService: PropertyService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.viewPermissionSubscription = this.propertyService.canView$
      .subscribe(hasViewPermission => {
        if (hasViewPermission) {
          this.fetch();
        } else {
          this.clear();
          this.notificationsService.permissionError().entity('entities.property.gen.plural').dispatch();
        }
      });

    this.busSubscription = this.propertyService
      .getAction(PropertyService.MESSAGE_PROPERTY_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedProperty$.next(this.selectedProperty);
      });

    this.selectedProperty$.subscribe(property =>
      this.propertyService.dispatchAction(PropertyService.MESSAGE_PROPERTY_SELECTED, property)
    );
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
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

  onSelect(properties: IProperty[]): void {
    const property = isEmpty(properties)
      ? null
      : properties[0];
    this.selectedProperty$.next(property);
  }

  onEdit(property: IProperty): void {
    this.routingService.navigate([ `property/${property.id}` ], this.route);
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
    this.routingService.navigate([ 'property/create' ], this.route);
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
