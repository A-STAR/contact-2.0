import {
  ChangeDetectionStrategy,
  Component,
  OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent implements OnInit {
  static COMPONENT_NAME = 'PaymentsComponent';
  constructor() { }

  ngOnInit(): void {
  }

}
