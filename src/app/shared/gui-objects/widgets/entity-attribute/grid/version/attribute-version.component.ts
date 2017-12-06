import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAttribute, IAttributeVersion } from '../../attribute.interface';
import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { AttributeService } from '../../attribute.service';
import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../../../../shared/components/grid/grid.component';

import { makeKey } from '../../../../../../core/utils';
import { DialogFunctions } from '../../../../../../core/dialog';
import { ActivatedRoute } from '@angular/router';
import { combineLatestAnd } from 'app/core/utils/helpers';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-version',
  templateUrl: './attribute-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeVersionComponent extends DialogFunctions implements OnInit, OnDestroy {

  @ViewChild(GridComponent) grid: GridComponent;

  selectedVersion$ = new BehaviorSubject<IAttributeVersion>(null);
  selectedAttribute: IAttribute;
  entityId: number;
  entityTypeId: number;

  dialog: string;

  rows: IAttributeVersion[] = [];
  private entitySubscription: Subscription;

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 150 },
    { prop: 'value', minWidth: 150 },
    { prop: 'typeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_ATTRIBUTE_TREE_TYPE },
    { prop: 'fromDateTime', minWidth: 150 },
    { prop: 'toDateTime', minWidth: 150 },
    { prop: 'userFullName', minWidth: 100 },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private gridService: GridService,
    private attributeService: AttributeService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  onRowSelect(version: IAttributeVersion): void {
    this.selectedVersion$.next(version);
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.entitySubscription = this.route.params
      .switchMap(params => {
        this.selectedAttribute = params.selectedAttribute;
        this.entityId = params.entityId;
        this.entityTypeId = params.entityTypeId;
        return this.userPermissionsService.contains('ATTRIBUTE_VERSION_VIEW_LIST', this.entityTypeId);
      })
      .subscribe(canView => {

        if (canView && this.entityTypeId && this.selectedAttribute.userId) {
          this.fetch();
        } else {
          this.rows = [];
          this.cdRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.entitySubscription.unsubscribe();
  }

  onRowDblClick(version: IAttributeVersion): void {
    this.selectedVersion$.next(version);
    this.canEdit$
      .pipe(first())
      .filter(Boolean)
      .subscribe(() => {
        this.setDialog('edit');
        this.cdRef.markForCheck();
      });
  }

  private fetch(): void {
    this.attributeService.fetchAllVersions(this.entityTypeId, this.entityId, this.selectedAttribute.code).subscribe(versions => {
      this.rows = versions;
      this.cdRef.markForCheck();
    });
  }

  private get canEdit$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
      Observable.of(!!this.selectedAttribute.version)
    ]);
  }

}
