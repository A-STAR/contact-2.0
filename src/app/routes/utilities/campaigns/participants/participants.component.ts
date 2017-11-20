import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { IParticipant, ICampaign } from '../campaigns.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { Subscription } from 'rxjs/Subscription';
import { CampaignsService } from '../campaigns.service';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { CampaignsDialogActionEnum } from '../campaigns.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { DialogFunctions } from '../../../../core/dialog/index';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantsComponent extends DialogFunctions implements OnInit, OnDestroy {
  static COMPONENT_NAME = 'ParticipantsComponent';

  @Input() campaign: Observable<ICampaign>;
  @ViewChild(GridComponent) grid: GridComponent;

  participants: IParticipant[];
  notAddedParticipants: IParticipant[];
  participantsSub: Subscription;

  dialog: string;
  selected: IParticipant[] = [];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 40 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'organization', minWidth: 150 },
    { prop: 'position', minWidth: 100 }
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.currentDialogAction = CampaignsDialogActionEnum.PARTICIPANT_ADD,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.campaignsService.selectedCampaign
      ).map(([hasPermissions, selectedCampaign]) => hasPermissions && !!selectedCampaign
        && (selectedCampaign.statusCode === 1 || selectedCampaign.statusCode === 3))
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.currentDialogAction = CampaignsDialogActionEnum.PARTICIPANT_REMOVE,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('CAMPAIGN_EDIT'),
        this.campaignsService.selectedCampaign,
        this.campaignsService.selectedParticipant
      ).map(([hasPermissions, selectedCampaign, selectedParticipant]) => hasPermissions && !!selectedCampaign
        && !!selectedParticipant && (selectedCampaign.statusCode === 1 || selectedCampaign.statusCode === 3))
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchParticipants(),
      enabled: Observable.of(true)
    }
  ];

  private currentDialogAction: CampaignsDialogActionEnum = CampaignsDialogActionEnum.NONE;

  constructor(private campaignsService: CampaignsService,
              private userPermissionsService: UserPermissionsService,
              private cdRef: ChangeDetectorRef) {
                super();
              }

  ngOnInit(): void {
    this.participantsSub = this.campaignsService.selectedCampaign
      .switchMap(() => this.campaignsService.fetchParticipants())
      .subscribe(participants => {
        this.participants = participants;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.participantsSub) {
      this.participantsSub.unsubscribe();
    }
  }

  get isEntityBeingAdded(): boolean {
    return this.currentDialogAction === CampaignsDialogActionEnum.PARTICIPANT_ADD;
  }

  get isEntityBeingRemoved(): boolean {
    return this.currentDialogAction === CampaignsDialogActionEnum.PARTICIPANT_REMOVE;
  }

  fetchParticipants(): void {
    this.campaignsService.fetchParticipants()
    .take(1)
    .subscribe(participants => {
      this.participants = participants;
      this.cdRef.markForCheck();
    });
  }

  onSelectParticipant(): void {
    const selectedParticipants = this.grid.getSelectedRows();
    if (selectedParticipants && selectedParticipants.length) {
      this.campaignsService.selectParticipant(selectedParticipants[selectedParticipants.length - 1]);
    } else {
      this.campaignsService.selectParticipant(null);
    }
  }

  onRemove(): void {
    this.campaignsService.removeParticipants(this.grid.selected.map(selection => selection.id))
    .switchMap(() => this.campaignsService.fetchParticipants())
    .take(1)
    .subscribe(participants => {
      this.participants = participants;
      this.cancelAction();
      this.cdRef.detectChanges();
    });
  }

  onAddSubmit(data: IParticipant[]): void {
    this.campaignsService.addParticipants(data.map(participant => participant.id))
      .switchMap(() => this.campaignsService.fetchParticipants())
      .take(1)
      .subscribe(participants => {
        this.participants = participants;
        this.cdRef.detectChanges();
      });
  }

  cancelAction(): void {
    this.currentDialogAction = CampaignsDialogActionEnum.NONE;
    this.grid.clearSelection();
    this.onCloseDialog();
  }
}
