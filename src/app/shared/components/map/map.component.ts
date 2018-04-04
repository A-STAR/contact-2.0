import { Component, OnInit, Inject } from '@angular/core';
import { MAP_SERVICE } from './map.module';
import { IMapService } from './map.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(@Inject(MAP_SERVICE) private mapService: IMapService ) { }

  ngOnInit(): void {
    this.mapService.init();
  }

}
