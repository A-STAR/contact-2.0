import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { AttributesService } from '../attributes.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-mass-attr-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedStage: IUserTerm;

  columns: ISimpleGridColumn<IUserTerm>[] = [
    { prop: 'code' },
    { prop: 'name' },
  ].map(addGridLabel('widgets.mass.changeStageAttr.grid'));

  stages: IUserTerm[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService
  ) { }

  ngOnInit(): void {
    this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_DEBT_STAGE_CODE)
      .pipe(first())
      .subscribe(stages => {
        this.stages = stages;
        this.cdRef.markForCheck();
      });
  }

  submit(): void {
    this.attributesService
      .change(this.actionData.payload, { stageCode: this.selectedStage.code })
      .subscribe(() => {
        this.close.emit({ refresh: false });
      });
  }

  get canSubmit(): boolean {
    return !!this.selectedStage;
  }

  onSelect(stage: IUserTerm[]): void {
    this.selectedStage = stage[0];
  }

  cancel(): void {
    this.close.emit();
  }

}
