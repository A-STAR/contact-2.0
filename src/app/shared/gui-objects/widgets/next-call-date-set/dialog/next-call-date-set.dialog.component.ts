import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, Inject } from '@angular/core';

import { ICloseAction } from '../../../../components/action-grid/action-grid.interface';
// import { IEntityGroup } from '../../../entity-group/entity-group.interface';

import { NextCallDateSetService } from '../next-call-date-set.service';

@Component({
  selector: 'app-next-call-date-set',
  templateUrl: './next-call-date-set.dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextCallDateSetDialogComponent  {
  @Input() debts: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private nextCallDateSetService: NextCallDateSetService,
  ) {}


  onClose(): void {
    console.log(this.debts);
    this.close.emit();
  }
}
