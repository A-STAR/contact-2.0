import { ChangeDetectionStrategy, ChangeDetectorRef, Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IGridColumn, IRenderer } from '../../../components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../components/toolbar-2/toolbar-2.interface';
import { IIdentityDoc } from './identity.interface';

import { GridService } from '../../../components/grid/grid.service';
import { IdentityService } from './identity.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-identity-grid',
  templateUrl: './identity.component.html',
})
export class IdentityGridComponent implements AfterViewInit {
  private _parentId: number;
  private dialog: string;
  // private selected: IIdentityDoc[];

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
    isMain: ({ isMain }) => isMain ? 'default.yesNo.Yes' : 'default.yesNo.No',
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: Observable.of(true),
      action: () => this.dialog = 'addIdentityComponent'
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: Observable.of(true),
      action: () => this.load()
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private gridService: GridService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  get parentId(): number {
    return this._parentId;
  }

  set parentId(id: number) {
    this._parentId = id;
  }

  ngAfterViewInit(): void {
    this.parentId = Number((this.route.params as any).value.id) || null;
    this.load();
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
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
        this.dialog = null;
        this.cdRef.markForCheck();
        this.load();
      });
  }

  onCancel(): void {
    this.dialog = null;
  }

  onSelect(row: IIdentityDoc): void {
    console.log('rows', row);
  }
}
