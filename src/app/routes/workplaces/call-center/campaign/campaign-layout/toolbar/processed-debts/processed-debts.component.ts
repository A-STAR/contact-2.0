import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { ICampaignProcessedDebt } from '../../../campaign.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IContactRegistrationParams } from '@app/routes/workplaces/shared/debt/debt.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { CampaignService } from '../../../campaign.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { RegisterContactOpenService } from '@app/shared/mass-ops/register-contact-open/register-contact-open.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { NumberRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-call-center-toolbar-processed-debts',
  templateUrl: 'processed-debts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessedDebtsComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  dialog = null;
  columns: ISimpleGridColumn<ICampaignProcessedDebt>[] = [
    { prop: 'personFullName', minWidth: 200 },
    { prop: 'debtId', minWidth: 50, maxWidth: 100 },
    { prop: 'contract' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS },
    { prop: 'debtAmount', minWidth: 150 },
    { prop: 'currencyName', renderer: NumberRendererComponent },
    { prop: 'dpd', minWidth: 100 },
  ].map(addGridLabel('modules.callCenter.processedDebts.grid'));

  debts: ICampaignProcessedDebt[];

  defaultAction = 'openDebtCard';

  actions: IMetadataAction[] = [
    {
      action: 'openDebtCard',
      params: [ 'debtId' ],
    },
    {
      action: 'registerContact',
      params: [ 'debtId', 'personId' ],
      addOptions: [
        {
          name: 'entityTypeId',
          value: [
            18
          ]
        },
        {
          name: 'campaignId',
          value: [
            this.campaignService.campaignId
          ]
        }
      ],
    }
  ];

  private registerContactActionSub: Subscription;

  constructor(
    private campaignService: CampaignService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private registerContactOpenService: RegisterContactOpenService,
  ) { }

  ngOnInit(): void {
    this.campaignService.fetchProcessedDebtsForCurrentCampaign()
      .subscribe(debts => {
        this.debts = debts;
        this.cdRef.markForCheck();
      });
    this.registerContactActionSub = this.registerContactOpenService
      .registerContactAction$
      .pipe(first())
      .filter(Boolean)
      .subscribe(this.onRegisterContactDialogSubmit.bind(this));
  }

  ngOnDestroy(): void {
    if (this.registerContactActionSub) {
      this.registerContactActionSub.unsubscribe();
    }
  }

  onRegisterContactDialogSubmit(params: Partial<IContactRegistrationParams>): void {
    if (params) {
      this.contactRegistrationService.startRegistration({
        contactId: params.contactId,
        contactType: params.contactType,
        debtId: params.debtId,
        personId: params.personId,
        personRole: 1,
        campaignId: params.campaignId
      });
      this.close.emit();
    }
  }

  onClose($event?: ICloseAction): void {
    if (!$event || !$event.metadataAction || $event.metadataAction.name !== 'registerContact') {
      this.close.emit();
    }
  }
}
