import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MAP_SERVICE } from '@app/core/map-providers/map-providers.module';

import { IMapService } from '@app/core/map-providers/map-providers.interface';
import { IMapToolbarFilter, IMapToolbarFilterItem } from '../toolbar/map-toolbar.interface';
import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFilterComponent implements OnInit {
  @Input() config: IMapToolbarFilter;
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;
  @Output() action = new EventEmitter<any>();

  container: HTMLElement;

  constructor(
    @Inject(MAP_SERVICE) private mapService: IMapService,
  ) { }

  ngOnInit(): void {
    this.container = this.mapService.container;
  }

  isDisabled(item: IMapToolbarFilterItem): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  onChildSelect(child: IMapToolbarFilterItem): void {
    this.dropdown.close();
    this.action.emit(child);
  }

}
