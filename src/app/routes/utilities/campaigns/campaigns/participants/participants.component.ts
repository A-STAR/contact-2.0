import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { ICampaign, IParticipant } from '../campaigns.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { CampaignsService } from '../campaigns.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog/index';

import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-participants',
  templateUrl: './participants.component.html',
})
export class ParticipantsComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IParticipant>;

  @Input() campaign: Observable<ICampaign>;

  participants: IParticipant[];
  notAddedParticipants: IParticipant[];
  participantsSub: Subscription;

  dialog: string;

  columns: ISimpleGridColumn<IParticipant>[] = [
    { prop: 'id', minWidth: 40 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'organization', minWidth: 150 },
    { prop: 'position', minWidth: 100 }
  ].map(addGridLabel('utilities.campaigns.participants.grid'));

  readonly titlebar: ITitlebar = {
    title: 'utilities.campaigns.tabs.participants',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.setDialog('PARTICIPANT_ADD'),
        enabled: combineLatest(
          this.userPermissionsService.has('CAMPAIGN_EDIT'),
          this.campaignsService.selectedCampaign,
        ).map(([hasPermissions, selectedCampaign]) => {
          return hasPermissions && !!selectedCampaign && [ 1, 3 ].includes(selectedCampaign.statusCode);
        }),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('PARTICIPANT_REMOVE'),
        enabled: combineLatest(
          this.userPermissionsService.has('CAMPAIGN_EDIT'),
          this.campaignsService.selectedCampaign,
          this.campaignsService.selectedParticipant,
        ).map(([hasPermissions, selectedCampaign, selectedParticipant]) => {
          return hasPermissions && !!selectedCampaign && !!selectedParticipant && [ 1, 3 ].includes(selectedCampaign.statusCode);
        }),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetchParticipants().subscribe(participants => this.onParticipantsFetch(participants)),
        enabled: this.userPermissionsService.has('CAMPAIGN_VIEW'),
      },
    ],
  };

  constructor(
    private campaignsService: CampaignsService,
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.participantsSub = this.campaignsService.selectedCampaign
      .switchMap(() => this.fetchParticipants())
      .subscribe(participants => this.onParticipantsFetch(participants));
  }

  ngOnDestroy(): void {
    if (this.participantsSub) {
      this.participantsSub.unsubscribe();
    }
  }

  fetchParticipants(): Observable<IParticipant[]> {
    return this.campaignsService.fetchParticipants().pipe(
      first(),
    );
  }

  onSelectParticipant(selection: any): void {
    const selectedParticipants = selection;
    if (selectedParticipants && selectedParticipants.length) {
      this.campaignsService.selectParticipant(selectedParticipants[0]);
    } else {
      this.campaignsService.selectParticipant(null);
    }
  }

  onRemove(): void {
    this.campaignsService.removeParticipants(this.grid.selection.map(selection => selection.id))
      .switchMap(() => this.fetchParticipants())
      .subscribe(participants => this.onParticipantsFetch(participants));
  }

  onAddSubmit(data: IParticipant[]): void {
    this.campaignsService.addParticipants(data.map(participant => participant.id))
      .switchMap(() => this.fetchParticipants())
      .subscribe(participants => this.onParticipantsFetch(participants));
  }

  cancelAction(): void {
    this.closeDialog();
  }

  onParticipantsFetch(participants: IParticipant[]): void {
    this.participants = participants;
    this.resetSelection();
    this.cancelAction();
    this.cdRef.markForCheck();
  }

  resetSelection(): void {
    this.grid.selection = [];
    this.campaignsService.selectParticipant(null);
  }
}
