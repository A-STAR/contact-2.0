import { Component, OnInit, Input } from '@angular/core';

import { IIndicator } from '../charts.interface';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit {
  @Input() data: IIndicator[];

  constructor() { }

  ngOnInit(): void {
  }

}
