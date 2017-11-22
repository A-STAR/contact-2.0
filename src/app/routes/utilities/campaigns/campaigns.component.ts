import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
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
export class CampaignsComponent extends DialogFunctions implements OnInit {
  static COMPONENT_NAME = 'CampaignsComponent';

  @ViewChild(GridComponent) grid: GridComponent;

  dialog: string;
  campaigns: ICampaign[];
  selectedRows$ = new BehaviorSubject<ICampaign[]>([]);

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
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.selectedRows$
      ).map(([hasPermissions, selectedItems]) => hasPermissions && (selectedItems.length === 1))
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('CAMPAIGN_REMOVE'),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('CAMPAIGN_DELETE'),
        this.selectedRows$
      )
        .map(([hasPermissions, selectedItems]) => hasPermissions && (selectedItems.length > 0)
          && selectedItems.every(selectedCampaign => selectedCampaign.statusCode !== CampaignStatus.STARTED))
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
      enabled: this.selectedRows$
        .map(campaigns => campaigns.every(selectedCampaign => selectedCampaign.statusCode === CampaignStatus.STARTED))
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_START,
      action: () => this.onStart(),
      label: this.translateService.instant('default.buttons.start'),
      align: 'right',
      enabled: this.selectedRows$
        .map(campaigns => campaigns.every(selectedCampaign => selectedCampaign.statusCode !== CampaignStatus.STARTED))
    },
  ];

  constructor(private gridService: GridService,
              private cdRef: ChangeDetectorRef,
              private campaignsService: CampaignsService,
              private translateService: TranslateService,
              private userPermissionsService: UserPermissionsService,
              private valueConverterService: ValueConverterService,
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

    this.fetchCampaigns()
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  get selectedCampaign(): Observable<ICampaign> {
    return this.campaignsService.selectedCampaign;
  }

  onSelectCampaign(selection: any): void {
    const selectedCampaigns = this.grid.getSelectedRows();
    if (selectedCampaigns.length) {
      this.campaignsService.selectCampaign(selectedCampaigns[0]);
    } else {
      this.campaignsService.selectCampaign(null);
    }
    this.selectedRows$.next(selectedCampaigns);
  }

  onCampaignDblClick(selection: ICampaign): void {
    const permission = 'CAMPAIGN_EDIT';
    this.userPermissionsService.has(permission)
      .take(1)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.setDialog(permission);
        } else {
          this.notificationsService.error('roles.permissions.messages.no_edit').params({ permission }).dispatch();
        }
      });
  }

  fetchCampaigns(): Observable<ICampaign[]> {
    return this.campaignsService.fetchCampaigns()
      .take(1);
  }

  createCampaign(campaign: ICampaign): void {
    campaign.statusCode = CampaignStatus.CREATED;

    this.campaignsService.createCampaign(campaign)
      .switchMap(() => this.fetchCampaigns())
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  updateCampaign(campaign: ICampaign): void {
    this.campaignsService.updateCampaign(campaign)
      .switchMap(() => this.fetchCampaigns())
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  onRemove(): void {
    this.campaignsService.removeCampaign()
      .switchMap(() => this.fetchCampaigns())
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  cancelAction(): void {
    this.closeDialog();
    this.grid.clearSelection();
  }

  onStart(): void {
    const onStartRequests: Observable<any>[] = this.grid.selected
      // updates campaign statusCode and returns request observable
      .map(campaign => this.campaignsService.updateCampaign({ id: campaign.id, statusCode: CampaignStatus.STARTED }));

    forkJoin(onStartRequests)
      .switchMap((...results) => this.fetchCampaigns())
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  onStop(): void {
    const onStopRequests: Observable<any>[] = this.grid.selected
      // updates campaign statusCode and returns request observable
      .map(campaign => this.campaignsService.updateCampaign({ id: campaign.id, statusCode: CampaignStatus.STOPPED }));

    forkJoin(onStopRequests)
      .switchMap((...results) => this.fetchCampaigns())
      .subscribe(campaigns => this.onCampaignsFetch(campaigns));
  }

  onCampaignsFetch(campaigns: ICampaign[]): void {
    this.campaigns = this.formatCampaignsDates(campaigns);
    this.cancelAction();
    this.cdRef.markForCheck();
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
