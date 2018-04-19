import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { IMapToolbarFilter } from '../toolbar/map-toolbar.interface';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFilterComponent implements OnInit {
  @Input() config: IMapToolbarFilter;
  constructor() { }

  ngOnInit(): void {
  }

}
