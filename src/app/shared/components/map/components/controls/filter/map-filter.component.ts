import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { IMapToolbarFilterItem } from '../toolbar/map-toolbar.interface';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFilterComponent implements OnInit {
  @Input() items: IMapToolbarFilterItem[];
  constructor() { }

  ngOnInit(): void {
  }

}
