import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';

import { IAction } from '@app/shared/mass-ops/mass-operation.interface';
import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IGenesysCampaign, GenesysCampaignStatus, GenesysCampaignType } from './genesys.interface';
import {
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { GenesysService } from '@app/routes/utilities/campaigns/genesys/genesys.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

import { isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-genesys-campaigns',
  templateUrl: 'genesys.component.html'
})
export class GenesysCampaignsComponent implements OnInit {

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IGenesysCampaign>;
  @ViewChild('campaigns', { read: TemplateRef }) campaigns: TemplateRef<any>;
  @ViewChild('statistics', { read: TemplateRef }) statistics: TemplateRef<any>;
  @ViewChild('start', { read: TemplateRef }) start: TemplateRef<any>;
  @ViewChild('stop', { read: TemplateRef }) stop: TemplateRef<any>;
  @ViewChild('load', { read: TemplateRef }) load: TemplateRef<any>;
  @ViewChild('unload', { read: TemplateRef }) unload: TemplateRef<any>;

  readonly layout: IDynamicLayoutConfig = {
    key: 'utilities/campaigns/genesys',
    items: [
      {
        type: DynamicLayoutItemType.GROUP,
        groupType: DynamicLayoutGroupType.VERTICAL,
        size: 100,
        children: [
          {
            type: DynamicLayoutItemType.TEMPLATE,
            value: 'campaigns',
            size: 50,
          },
          {
            type: DynamicLayoutItemType.TEMPLATE,
            value: 'statistics',
            size: 30,
          },
          {
            type: DynamicLayoutItemType.GROUP,
            groupType: DynamicLayoutGroupType.VERTICAL,
            size: 20,
            children: [
              {
                type: DynamicLayoutItemType.TEMPLATE,
                value: 'start',
              },
              {
                type: DynamicLayoutItemType.TEMPLATE,
                value: 'stop',
              },
            ],
          },
        ],
      },
    ],
  };

  private selectedCampaign$ = new BehaviorSubject<IGenesysCampaign>(null);

  readonly canLoad$ = this.selectedCampaign$.pipe(
    map(c => c && [ GenesysCampaignStatus.NOT_LOADED, GenesysCampaignStatus.UNLOADED ].includes(c.statusCode)),
  );

  readonly canUnload$ = this.selectedCampaign$.pipe(
    map(c => c && [ GenesysCampaignStatus.LOADED, GenesysCampaignStatus.STOPPED ].includes(c.statusCode)),
  );

  readonly canStart$ = this.selectedCampaign$.pipe(
    map(c => {
      return c && [
        GenesysCampaignStatus.LOADED,
        GenesysCampaignStatus.STOPPED,
        GenesysCampaignStatus.UNLOADING,
      ].includes(c.statusCode);
    }),
  );

  readonly canStop$ = this.selectedCampaign$.pipe(
    map(c => c && c.statusCode === GenesysCampaignStatus.STARTED),
  );

  readonly canSetOptimizationLevel$ = this.selectedCampaign$.pipe(
    map(c => c && c.statusCode !== GenesysCampaignStatus.STARTED && c.typeCode === GenesysCampaignType.AUTO_DIALER),
  );

  actionData: IAction;

  rows: IGenesysCampaign[] = [];
  rowCount = 0;

  templates: Record<string, TemplateRef<any>>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private genesysService: GenesysService,
  ) {}

  ngOnInit(): void {
    this.templates = {
      campaigns: this.campaigns,
      statistics: this.statistics,
      start: this.start,
      stop: this.stop,
      load: this.load,
      unload: this.unload,
    };
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.genesysService
      .fetch(filters, params)
      .subscribe((response: IAGridResponse<IGenesysCampaign>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onSelectRow(campaignIds: number[]): void {
    const campaign = isEmpty(campaignIds)
      ? null
      : this.rows.find(row => row.id === campaignIds[0]);
    this.selectedCampaign$.next(campaign);
  }

  onStart(): void {
    this.actionData = {
      id: 1,
    };
  }

  onStop(): void {
    this.actionData = {
      id: 1,
    };
  }

  onLoad(): void {
    this.actionData = {
      id: 1,
    };
  }

  onUnload(): void {
    this.actionData = {
      id: 1,
    };
  }

  onCloseAction(): void {
    this.actionData = null;
  }

  // private getActionData(actionId: number): IAction {
  //   const metadataAction = this.getMetadataAction(actionId);
  //   return {
  //     id: metadataAction.id,
  //     name: metadataAction.action,
  //     addOptions: metadataAction.addOptions,
  //     params: metadataAction.params,
  //     payload: {
  //       type: metadataAction.type,
  //       data: [
  //         metadataAction.params
  //           .map(param => this.context[param])
  //           .filter(Boolean)
  //       ]
  //     },
  //     asyncMode: metadataAction.asyncMode,
  //     outputConfig: metadataAction.outputConfig
  //   };
  // }
}