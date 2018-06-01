import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IVisit } from './visits.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { VisitService } from './visits.service';

import { addGridLabel } from '@app/core/utils';
import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers';

@Component({
  selector: 'app-address-grid-visits',
  templateUrl: './visits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridVisitsComponent implements OnInit {
  @Input() addressId: number;
  @Input() callCenter: boolean;
  @Input() personId: number;

  @Output() cancel = new EventEmitter<void>();

  columns: ISimpleGridColumn<IVisit>[] = [
    { prop: 'id', minWidth: 75, maxWidth: 150 },
    { prop: 'debtId', minWidth: 75, maxWidth: 150 },
    { prop: 'contract', minWidth: 150, maxWidth: 200 },
    { prop: 'statusCode', minWidth: 150, maxWidth: 200, dictCode: UserDictionariesService.DICTIONARY_VISIT_STATUS },
    { prop: 'purposeCode', minWidth: 150, maxWidth: 200, dictCode: UserDictionariesService.DICTIONARY_VISIT_PURPOSE },
    { prop: 'requestUserFullName', minWidth: 200, maxWidth: 250 },
    { prop: 'requestDateTime', minWidth: 150, maxWidth: 200, renderer: DateTimeRendererComponent },
    { prop: 'prepareUserFullName', minWidth: 200, maxWidth: 250 },
    { prop: 'prepareDateTime', minWidth: 150, maxWidth: 200, renderer: DateTimeRendererComponent },
    { prop: 'planUserFullName', minWidth: 200, maxWidth: 250 },
    { prop: 'planVisitDateTime', minWidth: 150, maxWidth: 200, renderer: DateTimeRendererComponent },
    { prop: 'execUserFullName', minWidth: 200, maxWidth: 250 },
    { prop: 'execDateTime', minWidth: 150, maxWidth: 200, renderer: DateTimeRendererComponent },
    { prop: 'comment', minWidth: 150 },
  ].map(addGridLabel('widgets.address.dialogs.visits.grid'));

  visits: IVisit[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private visitService: VisitService,
  ) {}

  ngOnInit(): void {
    this.visitService.fetchAll(this.personId, this.addressId, this.callCenter).subscribe(visits => {
      this.visits = visits;
      this.cdRef.markForCheck();
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
