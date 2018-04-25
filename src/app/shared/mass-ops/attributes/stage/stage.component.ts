import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

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

  selectedStage: IOption;

  columns: ISimpleGridColumn<IOption>[] = [
    { prop: 'value' },
    { prop: 'label' },
  ].map(addGridLabel('widgets.mass.changeStageAttr.grid'));

  stages: IOption[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService
  ) { }

  ngOnInit(): void {
    this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DEBT_STAGE_CODE)
      .pipe(first())
      .subscribe(stages => {
        this.stages = stages;
        this.cdRef.markForCheck();
      });
  }

  submit(): void {
    this.attributesService
      .change(this.actionData.payload, { stageCode: Number(this.selectedStage.value) })
      .subscribe(() => {
        this.close.emit({ refresh: false });
      });
  }

  get canSubmit(): boolean {
    return !!this.selectedStage;
  }

  onSelect(stage: IOption[]): void {
    this.selectedStage = stage[0];
  }

  cancel(): void {
    this.close.emit();
  }

}
