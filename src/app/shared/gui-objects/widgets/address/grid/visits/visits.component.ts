import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IVisit } from './visits.interface';

import { VisitService } from './visits.service';

@Component({
  selector: 'app-address-grid-visits',
  templateUrl: './visits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridVisitsComponent implements OnInit {
  @Input() addressId: number;
  @Input() personId: number;

  @Output() cancel = new EventEmitter<void>();

  private visits: IVisit[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private visitService: VisitService,
  ) {}

  ngOnInit(): void {
    this.visitService.fetchAll(this.personId, this.addressId).subscribe(visits => {
      this.visits = visits;
      this.cdRef.markForCheck();
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
