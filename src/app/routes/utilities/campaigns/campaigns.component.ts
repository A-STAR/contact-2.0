import { Component, ViewChild, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DialogFunctions } from '../../../core/dialog';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { IGridColumn } from '../../../shared/components/grid/grid.interface';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { CampaignsService } from './campaigns.service';
import { Observable } from 'rxjs/Observable';
import { ICampaign, CampaignsDialogActionEnum } from './campaigns.interface';
import { ToolbarItemTypeEnum, IToolbarItem } from '../../../shared/components/toolbar-2/toolbar-2.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsComponent extends DialogFunctions implements OnInit {
  static COMPONENT_NAME = 'CampaignsComponent';

  @ViewChild(GridComponent) grid: GridComponent;

  dialog: string;

  campaigns: Observable<ICampaign[]>;

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 40 },
    { prop: 'name', minWidth: 150 },
    { prop: 'groupName', minWidth: 150 },
    { prop: 'statusCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_STATUS },
    { prop: 'typeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_TYPE },
    { prop: 'startDateTime', minWidth: 100 },
    { prop: 'finishDateTime', minWidth: 100 },
    { prop: 'comment', minWidth: 100 },
    { prop: 'timeZoneUsed', minWidth: 150, renderer: 'checkboxRenderer' },
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
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.campaignsService.selectedCampaign
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.currentDialogAction = CampaignsDialogActionEnum.CAMPAIGN_REMOVE,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('CAMPAIGN_DELETE'),
        this.campaignsService.selectedCampaign
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchCampaigns(),
      enabled: Observable.of(true)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_STOP,
      action: () => this.onStop(),
      label: this.translateService.instant('default.buttons.stop'),
      align: 'right',
      enabled: this.campaignsService.selectedCampaign
        .map(selectedCampaign =>
          // todo get status code from dict
          !!selectedCampaign && selectedCampaign.statusCode === 2)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_START,
      action: () => this.onStart(),
      label: this.translateService.instant('default.buttons.start'),
      align: 'right',
      enabled: this.campaignsService.selectedCampaign
        .map(selectedCampaign =>
          // todo get status code from dict
          !!selectedCampaign && selectedCampaign.statusCode !== 2)
    },
  ];

  private currentDialogAction: CampaignsDialogActionEnum = CampaignsDialogActionEnum.NONE;

  constructor(private gridService: GridService,
              private cdRef: ChangeDetectorRef,
              private campaignsService: CampaignsService,
              private translateService: TranslateService,
              private userPermissionsService: UserPermissionsService) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .take(1)
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.campaigns = this.campaignsService.fetchCampaigns();

  }

  get isEntityBeingCreated(): boolean {
    return this.currentDialogAction === CampaignsDialogActionEnum.CAMPAIGN_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.currentDialogAction === CampaignsDialogActionEnum.CAMPAIGN_EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.currentDialogAction === CampaignsDialogActionEnum.CAMPAIGN_REMOVE;
  }

  onSelectCampaign(selection: ICampaign[]): void {
    console.log('in component', selection);
    this.campaignsService.selectCampaign(selection[0]);
  }

  fetchCampaigns(): void {
    this.campaignsService.fetchCampaigns().subscribe(() => this.cancelAction());
  }

  cancelAction(): void {
    this.currentDialogAction = CampaignsDialogActionEnum.NONE;
    this.onCloseDialog();
  }

  onStart(): void {
    this.grid.selected.map(campaign => {
      // get from dict
      campaign.statusCode = 2;
      return campaign;
    });
    this.cdRef.markForCheck();
  }
  onStop(): void {
    this.grid.selected.map(campaign => {
      // get from dict
      campaign.statusCode = 4;
      return campaign;
    });
    this.cdRef.markForCheck();
  }
}
