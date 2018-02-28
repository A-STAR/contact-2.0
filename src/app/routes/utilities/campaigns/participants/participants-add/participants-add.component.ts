import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IParticipant } from '../../campaigns.interface';

import { CampaignsService } from '../../campaigns.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { addGridLabel } from '@app/core/utils';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

@Component({
  selector: 'app-participants-add',
  templateUrl: './participants-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantsAddComponent implements OnInit, OnDestroy {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IParticipant>;

  notAddedParticipants: IParticipant[];

  columns: ISimpleGridColumn<IParticipant>[] = [
    { prop: 'id', minWidth: 40 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'organization', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
  ].map(addGridLabel('utilities.campaigns.participants.add.grid'));

  private notAddedParticipantsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private campaignsService: CampaignsService,
  ) {}

  ngOnInit(): void {
    this.notAddedParticipantsSub = this.campaignsService.fetchNotAddedParticipants().subscribe(participants => {
      this.notAddedParticipants = participants;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.notAddedParticipantsSub.unsubscribe();
  }

  onSubmit(): void {
    this.submit.emit(this.grid.selection);
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  canSubmit(): boolean {
    return this.grid.selection.length > 0;
  }

  onSelectParticipants(): void {

  }
}
