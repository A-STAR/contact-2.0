import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments-filter',
  templateUrl: './payments-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
