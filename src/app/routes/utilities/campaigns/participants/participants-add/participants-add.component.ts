import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { IParticipant } from '../../campaigns.interface';
import { CampaignsService } from '../../campaigns.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { GridComponent } from '../../../../../shared/components/grid/grid.component';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-participants-add',
  templateUrl: './participants-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantsAddComponent implements OnInit, OnDestroy {
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  notAddedParticipants: IParticipant[];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 40 },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'organization', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
  ];

  private notAddedParticipantsSub: Subscription;

  constructor(private cdRef: ChangeDetectorRef,
              private campaignsService: CampaignsService) { }

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
    this.submit.emit(this.grid.getSelectedRows());
    this.onCancel();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  canSubmit(): boolean {
    return this.grid.getSelectedRows().length > 0;
  }

  onSelectParticipants(): void {

  }

}
