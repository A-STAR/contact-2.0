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
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { CampaignsService } from '../campaigns.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

import { DialogFunctions } from '../../../../core/dialog/index';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-participants',
  templateUrl: './participants.component.html',
})
export class ParticipantsComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() campaign: Observable<ICampaign>;

  participants: IParticipant[];
  notAddedParticipants: IParticipant[];
  participantsSub: Subscription;

  dialog: string;

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 40 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'organization', minWidth: 150 },
    { prop: 'position', minWidth: 100 }
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () =>  this.setDialog('PARTICIPANT_ADD'),
      enabled: combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.campaignsService.selectedCampaign
      ).map(([hasPermissions, selectedCampaign]) => hasPermissions && !!selectedCampaign
        && (selectedCampaign.statusCode === 1 || selectedCampaign.statusCode === 3))
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('PARTICIPANT_REMOVE'),
      enabled: combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.campaignsService.selectedCampaign,
        this.campaignsService.selectedParticipant
      ).map(([hasPermissions, selectedCampaign, selectedParticipant]) => hasPermissions && !!selectedCampaign
        && !!selectedParticipant && (selectedCampaign.statusCode === 1 || selectedCampaign.statusCode === 3))
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchParticipants().subscribe(participants => this.onParticipantsFetch(participants)),
      enabled: this.userPermissionsService.has('CAMPAIGN_VIEW')
    }
  ];

  constructor(private campaignsService: CampaignsService,
              private userPermissionsService: UserPermissionsService,
              private cdRef: ChangeDetectorRef) {
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
    return this.campaignsService.fetchParticipants()
    .pipe(first());
  }

  onSelectParticipant(selection: any): void {
    const selectedParticipants = this.grid.getSelectedRows();
    if (selectedParticipants && selectedParticipants.length) {
      this.campaignsService.selectParticipant(selectedParticipants[0]);
    } else {
      this.campaignsService.selectParticipant(null);
    }
  }

  onRemove(): void {
    this.campaignsService.removeParticipants(this.grid.selected.map(selection => selection.id))
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
    this.grid.clearSelection();
    this.campaignsService.selectParticipant(null);
  }
}
