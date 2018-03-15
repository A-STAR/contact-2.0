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

import { ICampaign, CampaignStatus } from './campaigns.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';
import { ToolbarItemTypeEnum, IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { CampaignsService } from './campaigns.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';

import { addGridLabel, isEmpty } from '@app/core/utils';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
})
export class CampaignsComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<ICampaign>;

  dialog: string;
  campaigns: ICampaign[];

  columns: ISimpleGridColumn<ICampaign>[] = [
    { prop: 'id', minWidth: 40 },
    { prop: 'name', minWidth: 150 },
    { prop: 'groupName', minWidth: 150 },
    { prop: 'statusCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_STATUS },
    { prop: 'typeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_CALL_CAMPAIGN_TYPE },
    { prop: 'startDateTime', minWidth: 150 },
    { prop: 'finishDateTime', minWidth: 150 },
    { prop: 'comment', minWidth: 100 },
    { prop: 'timeZoneUsed', minWidth: 50, renderer: TickRendererComponent },
  ].map(addGridLabel('utilities.campaigns.grid'));

  tabs = [
    { isInitialised: true, },
    { isInitialised: false, },
  ];

  titlebar: ITitlebar = {
    title: 'utilities.campaigns.titlebar.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_START,
        action: () => this.onStart(),
        title: 'default.buttons.start',
        enabled: combineLatest(
          this.userPermissionsService.has('CAMPAIGN_EDIT'),
          this.selectedCampaign
        )
          .map(([hasPermissions, selectedCampaign]) => hasPermissions && !!selectedCampaign
            && selectedCampaign.statusCode !== CampaignStatus.STARTED)
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_STOP,
        action: () => this.onStop(),
        title: 'default.buttons.stop',
        enabled: combineLatest(
          this.userPermissionsService.has('CAMPAIGN_EDIT'),
          this.selectedCampaign
        )
          .map(([canEdit, selectedCampaign]) => canEdit && !!selectedCampaign
            && selectedCampaign.statusCode === CampaignStatus.STARTED)
      },
    ]
  };

  toolbarItems: IToolbarItem[] = [
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
  ];

  constructor(
    private campaignsService: CampaignsService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchCampaigns()
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  ngOnDestroy(): void {
    this.campaignsService.selectCampaign(null);
  }

  get selectedCampaign(): Observable<ICampaign> {
    return this.campaignsService.selectedCampaign;
  }

  onSelectCampaign(campaigns: ICampaign[]): void {
    const campaign = isEmpty(campaigns)
      ? null
      : campaigns[0];
    this.campaignsService.selectCampaign(campaign);
  }

  onCampaignDblClick(): void {
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
    this.grid.selection = [];
    this.campaignsService.selectCampaign(null);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
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
