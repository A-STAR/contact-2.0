import { ChangeDetectionStrategy, ChangeDetectorRef, Component, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn, IRenderer } from '../../../components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../components/toolbar-2/toolbar-2.interface';
import { IIdentityDoc } from './identity.interface';

// import { Dialog } from '../../../../core/decorators/dialog';
import { GridService } from '../../../components/grid/grid.service';
import { IdentityService } from './identity.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { GridComponent } from '../../../components/grid/grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-identity-grid',
  templateUrl: './identity.component.html',
})
export class IdentityGridComponent implements AfterViewInit {
  @ViewChild(GridComponent) grid: GridComponent;

  private parentId: number;
  private dialog: string;
  private selectedRows$ = new BehaviorSubject<IIdentityDoc[]>([]);

  identityDoc: IIdentityDoc;
  rows: IIdentityDoc[] = [];

  columns: Array<IGridColumn> = [
    { prop: 'docTypeCode', maxWidth: 50, type: 'number' },
    { prop: 'docNumber', type: 'string', maxWidth: 70 },
    { prop: 'issueDate', type: 'date' },
    { prop: 'issuePlace', type: 'string' },
    { prop: 'expiryDate', type: 'date' },
    { prop: 'citizenship', type: 'string' },
    { prop: 'isMain', localized: true, maxWidth: 70 },
  ];

  renderers: IRenderer = {
    expiryDate: ({ expiryDate }) => this.valueConverterService.ISOToLocalDateTime(expiryDate) || '',
    issueDate: ({ issueDate }) => this.valueConverterService.ISOToLocalDateTime(issueDate) || '',
    isMain: ({ isMain }) => isMain ? 'default.yesNo.Yes' : 'default.yesNo.No',
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.setDialog('addIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedRows$)
        .map(([canDelete, selected]) => canDelete && selected.length === 1),
      action: () => this.setDialog('editIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedRows$)
        .map(([canDelete, selected]) => canDelete && !!selected.length),
      action: () => this.setDialog('removeIdentity')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.load()
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private gridService: GridService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  ngAfterViewInit(): void {
    this.parentId = Number((this.route.params as any).value.id) || null;
    this.load();
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string): void {
    this.dialog = dialog;
  }

  load(): void {
    if (this.parentId) {
      this.identityService
        .fetch(this.parentId)
        .subscribe(identities => {
          this.rows = identities;
          this.cdRef.markForCheck();
        });
    }
  }

  onAddDocument(doc: IIdentityDoc): void {
    this.identityService.create(this.parentId, doc)
      .subscribe(result => {
        this.setDialog(null);
        this.cdRef.markForCheck();
        this.load();
      });
  }

  onCancel(): void {
    this.setDialog(null);
  }

  onRemove(): void {
    this.setDialog(null);
    this.identityService.delete(this.parentId, this.grid.selected[0].id)
      .subscribe(result => {
        if (result) { this.load(); }
      });
  }

  onSelect(doc: IIdentityDoc): void {
    this.identityDoc = doc;
    this.selectedRows$.next(this.grid.selected);
  }

  onDoubleClick(doc: IIdentityDoc): void {
    this.setDialog('editIdentity');
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_EDIT').distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('IDENTITY_DOCUMENT_DELETE').distinctUntilChanged();
  }
}
