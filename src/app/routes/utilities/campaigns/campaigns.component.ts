import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { DialogFunctions } from '../../../core/dialog';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { IGridColumn } from '../../../shared/components/grid/grid.interface';
import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';
import { CampaignsService } from './campaigns.service';
import { Observable } from 'rxjs/Observable';
import { ICampaign, CampaignsDialogActionEnum } from './campaigns.interface';
import { ToolbarItemTypeEnum, IToolbarItem } from '../../../shared/components/toolbar-2/toolbar-2.interface';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends DialogFunctions implements OnInit {
  static COMPONENT_NAME = 'CampaignsComponent';

  @ViewChild(GridComponent) grid: GridComponent;

  dialog: string;

  campaigns: Observable<ICampaign[]>;

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 150 },
    { prop: 'name', minWidth: 100 },
    { prop: 'groupName', minWidth: 100 },
    { prop: 'statusCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_STATUS },
    { prop: 'typeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_TYPE },
    { prop: 'startDateTime', minWidth: 100 },
    { prop: 'finishtDateTime', minWidth: 100 },
    { prop: 'comment', minWidth: 100 },
    { prop: 'timeZoneUsed', minWidth: 100, renderer: 'checkboxRenderer' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.currentDialogAction = CampaignsDialogActionEnum.CAMPAIGN_ADD,
      enabled: this.userPermissionsService.has('CAMPAIGN_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.currentDialogAction = CampaignsDialogActionEnum.CAMPAIGN_EDIT,
      enabled: Observable.of(true)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.currentDialogAction = CampaignsDialogActionEnum.CAMPAIGN_REMOVE,
      enabled: Observable.of(true)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchCampaigns(),
      enabled: Observable.of(true)
    },
  ];

  private currentDialogAction: CampaignsDialogActionEnum = CampaignsDialogActionEnum.NONE;

  constructor(private gridService: GridService,
              private cdRef: ChangeDetectorRef,
              private campaignsService: CampaignsService,
              private userPermissionsService: UserPermissionsService) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .take(1)
    .subscribe(columns => {
      this.columns = [...columns];
    });

    this.campaigns = this.campaignsService.fetchCampaigns();

  }

  onSelectCampaign(campaign: ICampaign): void {
      console.log(campaign);
  }

  fetchCampaigns(): void {
    this.campaignsService.fetchCampaigns().subscribe(() => this.cancelAction());
  }

  cancelAction(): void {
    this.currentDialogAction = CampaignsDialogActionEnum.NONE;
    this.onCloseDialog();
  }
}
