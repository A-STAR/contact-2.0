import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { DialogFunctions } from '../../../core/dialog';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { IGridColumn } from '../../../shared/components/grid/grid.interface';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { CampaignsService } from './campaigns.service';
import { Observable } from 'rxjs/Observable';
import { ICampaign, CampaignsDialogActionEnum, CampaignStatus } from './campaigns.interface';
import { ToolbarItemTypeEnum, IToolbarItem } from '../../../shared/components/toolbar-2/toolbar-2.interface';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NotificationsService } from '../../../core/notifications/notifications.service';

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
  campaigns: ICampaign[];

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
          !!selectedCampaign && selectedCampaign.statusCode === CampaignStatus.STARTED)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_START,
      action: () => this.onStart(),
      label: this.translateService.instant('default.buttons.start'),
      align: 'right',
      enabled: this.campaignsService.selectedCampaign
        .map(selectedCampaign =>
          !!selectedCampaign && selectedCampaign.statusCode !== CampaignStatus.STARTED)
    },
  ];

  private currentDialogAction: CampaignsDialogActionEnum = CampaignsDialogActionEnum.NONE;

  constructor(private gridService: GridService,
              private cdRef: ChangeDetectorRef,
              private campaignsService: CampaignsService,
              private translateService: TranslateService,
              private userPermissionsService: UserPermissionsService,
              private notificationsService: NotificationsService) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .take(1)
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.fetchCampaigns();
  }

  get selectedCampaign(): Observable<ICampaign> {
    return this.campaignsService.selectedCampaign;
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

  onSelectCampaign(): void {
    const selectedCampaigns = this.grid.getSelectedRows();
    if (selectedCampaigns && selectedCampaigns.length) {
      this.campaignsService.selectCampaign(selectedCampaigns[selectedCampaigns.length - 1]);
    } else {
      this.campaignsService.selectCampaign(null);
    }
  }

  onCampaignDblClick(selection: ICampaign): void {
    const permission = 'CAMPAIGN_EDIT';
    this.userPermissionsService.has(permission)
      .take(1)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.currentDialogAction = CampaignsDialogActionEnum.CAMPAIGN_EDIT;
        } else {
          this.notificationsService.error('roles.permissions.messages.no_edit').params({ permission }).dispatch();
        }
      });
  }

  fetchCampaigns(): Subscription {
    return this.campaignsService.fetchCampaigns()
      .take(1)
      .subscribe(campaigns => {
        this.campaigns = campaigns;
        this.cancelAction();
        this.cdRef.markForCheck();
      });
  }

  createCampaign(campaign: ICampaign): void {
    campaign.statusCode = CampaignStatus.CREATED;

    this.campaignsService.createCampaign(campaign)
      .map(() => this.fetchCampaigns())
      .subscribe(() => this.cdRef.detectChanges());
  }

  updateCampaign(campaign: ICampaign): void {
    this.campaignsService.updateCampaign(campaign)
    .map(() => this.fetchCampaigns())
    .subscribe(() => this.cdRef.detectChanges());
  }

  onRemove(): void {
    this.campaignsService.removeCampaign()
    .switchMap(() => this.campaignsService.fetchCampaigns())
    .subscribe(() => this.cdRef.detectChanges());
  }

  cancelAction(): void {
    this.currentDialogAction = CampaignsDialogActionEnum.NONE;
    this.grid.clearSelection();
    this.onCloseDialog();
  }

  onStart(): void {
    const onStartRequests: Observable<any>[] = this.grid.selected
      // updates campaign statusCode and returns request observable
      .map(campaign => this.campaignsService.updateCampaign({ ...campaign, statusCode: CampaignStatus.STARTED }));

    forkJoin(onStartRequests).take(1).subscribe(() => this.cdRef.markForCheck());
  }

  onStop(): void {
    const onStopRequests: Observable<any>[] = this.grid.selected
      // updates campaign statusCode and returns request observable
      .map(campaign => this.campaignsService.updateCampaign({ ...campaign, statusCode: CampaignStatus.STOPPED }));

    forkJoin(onStopRequests).take(1).subscribe(() => this.cdRef.markForCheck());
  }
}
