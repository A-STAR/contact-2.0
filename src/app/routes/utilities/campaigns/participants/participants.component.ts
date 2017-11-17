import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { IParticipant, ICampaign } from 'app/routes/utilities/campaigns/campaigns.interface';
import { IGridColumn } from 'app/shared/components/grid/grid.interface';
import { Subscription } from 'rxjs/Subscription';
import { CampaignsService } from 'app/routes/utilities/campaigns/campaigns.service';
import { GridComponent } from 'app/shared/components/grid/grid.component';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit, OnDestroy {
  @Input() campaign: Observable<ICampaign>;
  @ViewChild(GridComponent) grid: GridComponent;

  participants: IParticipant[];
  participantsSub: Subscription;

  columns: Array<IGridColumn> = [
    { prop: 'userId', minWidth: 40 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'organization', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
  ];

  constructor(private campaignsService: CampaignsService,
              private cdRef: ChangeDetectorRef) { }

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

  fetchParticipants(): Observable<IParticipant[]> {
    return this.campaignsService.fetchParticipants();
  }

  onSelectParticipant(data: any): void {

  }
}
