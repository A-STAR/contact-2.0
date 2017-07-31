import { ChangeDetectionStrategy, ChangeDetectorRef, Component, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridColumn, IRenderer } from '../../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../../shared/components/toolbar-2/toolbar-2.interface';
import { IIdentityDoc } from './identity.interface';

import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { IdentityService } from './identity.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-identity-grid',
  templateUrl: './identity.component.html',
})
export class IdentityGridComponent implements AfterViewInit {
  private _parentId: number;

  rows: IIdentityDoc[] = [];

  columns: Array<IGridColumn> = [
    { prop: 'docTypeCode', maxWidth: 50, type: 'number' },
    { prop: 'docNumber', type: 'number', maxWidth: 70 },
    { prop: 'issueDate', type: 'date' },
    { prop: 'issuePlace', type: 'string' },
    { prop: 'expiryDate', type: 'date' },
    { prop: 'citizenship', type: 'string' },
    { prop: 'isMain', localized: true, maxWidth: 70 },
  ];

      // {
      //   title: 'debtor.generalInformationTab.passport',
      //   width: 6,
      //   children: [
      //     {
      //       children: [
      //         {
      //           width: 4,
      //           label: 'debtor.generalInformationTab.series',
      //           controlName: 'series',
      //           type: 'text'
      //         },
      //         {
      //           width: 4,
      //           label: 'debtor.generalInformationTab.number',
      //           controlName: 'number',
      //           type: 'text'
      //         },
      //         {
      //           width: 4,
      //           label: 'debtor.generalInformationTab.issueDate',
      //           controlName: 'issueDate',
      //           type: 'datepicker'
      //         }
      //       ]
      //     },
      //     {
      //       label: 'debtor.generalInformationTab.issuedBy',
      //       controlName: 'issuedBy',
      //       type: 'text'
      //     },
      //     {
      //       label: 'debtor.generalInformationTab.birthPlace',
      //       controlName: 'birthPlace',
      //       type: 'text'
      //     }
      //   ]
      // }

  renderers: IRenderer = {
    type: [
      { label: 'Home phone', value: 1 },
      { label: 'Work phone', value: 2 },
      { label: 'Mobile phone', value: 3 },
    ],
    status: [
      { label: 'Did not call at all', value: 1 },
    ],
    active: [
      { label: 'TRUE', value: 1 },
    ],
    numberExists: [
      { label: 'TRUE', value: 1 },
    ],
    isMain: ({ isMain }) => isMain ? 'default.yesNo.Yes' : 'default.yesNo.No',
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: Observable.of(true),
      action: () => {}
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
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_SMS,
      enabled: Observable.of(true),
      action: () => {}
    },
    // {
    //   type: ToolbarItemTypeEnum.CHECKBOX,
    //   label: 'debtor.generalInformationTab.phonesTab.contactsVerification',
    //   enabled: Observable.of(true),
    //   action: () => {}
    // }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private gridService: GridService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  ngAfterViewInit(): void {
    this.setParentId(23);
    this.identityService
      .fetch(this._parentId)
      .subscribe(identities => {
        this.rows = identities;
        this.cdRef.markForCheck();
      });
  }

  setParentId(id: number): void {
    this._parentId = id;
  }
}
