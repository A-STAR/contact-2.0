import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IAttribute, IAttributeVersion } from '../../attribute.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { Toolbar, ToolbarItemType } from '@app/shared/components/toolbar/toolbar.interface';

import { AttributeService } from '../../attribute.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers/datetime/datetime.component';
import { DialogFunctions } from '@app/core/dialog';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-attribute-version',
  templateUrl: './attribute-version.component.html',
})
export class AttributeVersionComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input() attributeId: number;
  @Input() entityId: number;
  @Input() entityTypeId: number;

  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IAttribute>;

  selectedVersion$ = new BehaviorSubject<IAttributeVersion>(null);
  selectedAttribute: IAttribute;

  toolbar: Toolbar;

  dialog: string;

  rows: IAttributeVersion[] = [];
  private entitySubscription: Subscription;

  columns: ISimpleGridColumn<IAttribute>[] = [
    { prop: 'code', minWidth: 50 },
    { prop: 'name', minWidth: 150 },
    { prop: 'typeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_VARIABLE_TYPE },
    { prop: 'value', minWidth: 150, valueTypeKey: 'typeCode',
      valueTypeParams: {
        dictCode: row => row.dictNameCode
      },
    },
    { prop: 'fromDateTime', minWidth: 150, renderer: DateTimeRendererComponent },
    { prop: 'toDateTime', minWidth: 150, renderer: DateTimeRendererComponent },
    { prop: 'userFullName', minWidth: 150 },
  ].map(addGridLabel('widgets.attribute.grid'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private attributeService: AttributeService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  onRowSelect(versions: IAttributeVersion[]): void {
    if (!isEmpty(versions)) {
      const [ version ] = versions;
      this.selectedVersion$.next(version);
    }
  }

  ngOnInit(): void {
    this.entitySubscription = this.userPermissionsService.contains('ATTRIBUTE_VERSION_VIEW_LIST', this.entityTypeId)
      .switchMap(canView => {
        return canView && this.entityTypeId && this.attributeId
          ? this.fetchAll()
          : of([]);
      })
      .subscribe(versions => {
        this.onVersionsFetch(versions);
        this.toolbar = this.getToolbarConfig();
      });
  }

  ngOnDestroy(): void {
    this.grid.selection = [];
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

  onEditDialogSubmit(version: IAttributeVersion): void {
    this.attributeService.update(this.entityTypeId, this.entityId, this.selectedAttribute.code, version)
      .switchMap(() => this.fetch())
      .subscribe(versions => this.onVersionsFetch(versions));
  }

  private fetchAll(): Observable<IAttributeVersion[]> {
    return this.fetchAttribute().switchMap(attr => {
      this.selectedAttribute = attr;
      return this.fetch();
    });
  }

  private fetch(): Observable<IAttributeVersion[]> {
    return this.attributeService.fetchAllVersions(this.entityTypeId, this.entityId, this.attributeId);
  }

  private fetchAttribute(): Observable<IAttribute> {
    return this.attributeService.fetch(this.entityTypeId, this.entityId, this.attributeId);
  }

  private onVersionsFetch(versions: IAttributeVersion[]): void {
    this.rows = this.processVersions(versions);
    this.setDialog(null);
    this.clearSelection();
    this.cdRef.markForCheck();
  }

  private clearSelection(): void {
    this.grid.selection = [];
    this.selectedVersion$.next(null);
  }

  private get canEdit$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
      of(this.selectedAttribute && this.selectedAttribute.disabledValue !== -1),
    ]);
  }

  private getToolbarConfig(): Toolbar {
    return {
      items: [
        {
          type: ToolbarItemType.BUTTON,
          buttonType: ButtonType.EDIT,
          action: () => this.setDialog('edit'),
          enabled: combineLatestAnd([
            this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
            of(this.selectedAttribute && this.selectedAttribute.disabledValue !== -1),
            this.selectedVersion$.map(version => !!version)
          ]),
        },
        {
          type: ToolbarItemType.BUTTON,
          buttonType: ButtonType.REFRESH,
          action: () => this.entityTypeId && this.entityId && this.selectedAttribute
            && this.fetch().subscribe(versions => this.onVersionsFetch(versions)),
        },
      ]
    };
  }

  private processVersions(versions: IAttributeVersion[]): IAttributeVersion[] {
    return versions.map(version => ({
      ...version,
      code: this.selectedAttribute.code,
      name: this.selectedAttribute.name,
    }));
  }
}
