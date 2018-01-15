import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ICampaign, CampaignStatus } from './campaigns.interface';
import { IGridColumn } from '../../../shared/components/grid/grid.interface';
import { ToolbarItemTypeEnum, IToolbarItem } from '../../../shared/components/toolbar-2/toolbar-2.interface';

import { CampaignsService } from './campaigns.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

import { GridComponent } from '../../../shared/components/grid/grid.component';

import { DialogFunctions } from '../../../core/dialog';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  dialog: string;
  campaigns: ICampaign[];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 40 },
    { prop: 'name', minWidth: 150 },
    { prop: 'groupName', minWidth: 150 },
    { prop: 'statusCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_STATUS },
    { prop: 'typeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_TYPE },
    { prop: 'startDateTime', minWidth: 150 },
    { prop: 'finishDateTime', minWidth: 150 },
    { prop: 'comment', minWidth: 100 },
    { prop: 'timeZoneUsed', minWidth: 50, renderer: 'checkboxRenderer' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.setDialog('CAMPAIGN_ADD'),
      enabled: this.userPermissionsService.has('CAMPAIGN_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.setDialog('CAMPAIGN_EDIT'),
      enabled: combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.selectedCampaign
      ).map(([canEdit, selectedCampaign]) => canEdit && !!selectedCampaign)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('CAMPAIGN_REMOVE'),
      enabled: combineLatest(
        this.userPermissionsService.has('CAMPAIGN_DELETE'),
        this.selectedCampaign
      )
        .map(([canDelete, selectedCampaign]) => canDelete &&
          !!selectedCampaign && selectedCampaign.statusCode !== CampaignStatus.STARTED)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchCampaigns().subscribe(campaigns => this.onCampaignsFetch(campaigns)),
      enabled: this.userPermissionsService.has('CAMPAIGN_VIEW')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_STOP,
      action: () => this.onStop(),
      label: this.translateService.instant('default.buttons.stop'),
      align: 'right',
      enabled: combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.selectedCampaign
      )
        .map(([canEdit, selectedCampaign]) => canEdit && !!selectedCampaign
          && selectedCampaign.statusCode === CampaignStatus.STARTED)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_START,
      action: () => this.onStart(),
      label: this.translateService.instant('default.buttons.start'),
      align: 'right',
      enabled: combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.selectedCampaign
      )
        .map(([hasPermissions, selectedCampaign]) => hasPermissions && !!selectedCampaign
          && selectedCampaign.statusCode !== CampaignStatus.STARTED)
    },
  ];

  constructor(
    private campaignsService: CampaignsService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
  }

  ngOnInit(): void {

    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.fetchCampaigns()
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  ngOnDestroy(): void {
    this.campaignsService.selectCampaign(null);
  }

  get selectedCampaign(): Observable<ICampaign> {
    return this.campaignsService.selectedCampaign;
  }

  onSelectCampaign(campaign?: ICampaign): void {
    this.campaignsService.selectCampaign(campaign);
  }

  onCampaignDblClick(selection: ICampaign): void {
    const permission = 'CAMPAIGN_EDIT';
    this.userPermissionsService.has(permission)
      .pipe(first())
      .subscribe(canEdit => {
        if (canEdit) {
          this.setDialog(permission);
        } else {
          this.notificationsService.error('roles.permissions.messages.no_edit').params({ permission }).dispatch();
        }
      });
  }

  fetchCampaigns(): Observable<ICampaign[]> {
    return this.campaignsService.fetchCampaigns().pipe(first());
  }

  createCampaign(campaign: ICampaign): void {
    campaign.statusCode = CampaignStatus.CREATED;

    this.campaignsService.createCampaign(campaign)
      .pipe(
        switchMap(() => this.fetchCampaigns())
      )
      .subscribe(campaigns => {
        this.onCampaignsFetch(campaigns);
        this.setDialog();
      });
  }

  updateCampaign(campaign: ICampaign): void {
    this.selectedCampaign
      .pipe(
        first(),
        switchMap(selectedCampaign => this.campaignsService.updateCampaign({ ...campaign, id: selectedCampaign.id })),
        switchMap(() => this.fetchCampaigns())
      )
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  onRemove(): void {
    this.campaignsService.removeCampaign()
      .pipe(
        switchMap(() => this.fetchCampaigns())
      )
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  onStart(): void {
    this.selectedCampaign
      .pipe(
        first(),
        switchMap(campaign => this.campaignsService.updateCampaign({ id: campaign.id, statusCode: CampaignStatus.STARTED })),
        switchMap(() => this.fetchCampaigns()),
      )
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  onStop(): void {
    this.selectedCampaign
      .pipe(
        first(),
        switchMap(campaign => this.campaignsService.updateCampaign({ id: campaign.id, statusCode: CampaignStatus.STOPPED })),
        switchMap(() => this.fetchCampaigns()),
      )
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  onCampaignsFetch(campaigns: ICampaign[]): void {
    this.closeDialog();
    this.resetSelection();
    this.campaigns = this.formatCampaignsDates(campaigns);
    this.cdRef.markForCheck();
  }

  resetSelection(): void {
    this.grid.clearSelection();
    this.campaignsService.selectCampaign(null);
  }

  private formatCampaignsDates(campaings: ICampaign[]): ICampaign[] {
    return campaings.map(campaign => {
      let finishDateTime, startDateTime;
      if (campaign.finishDateTime) {
        finishDateTime = this.valueConverterService.toLocalDateTime(this.valueConverterService.fromISO(campaign.finishDateTime));
      }
      if (campaign.startDateTime) {
        startDateTime = this.valueConverterService.toLocalDateTime(this.valueConverterService.fromISO(campaign.startDateTime));
      }
      return {
        ...campaign,
        startDateTime,
        finishDateTime
      };
    });
  }
}
