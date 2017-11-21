import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments-grid',
  templateUrl: './payments-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsGridComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
