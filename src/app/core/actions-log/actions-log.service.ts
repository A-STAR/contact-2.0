import { Injectable } from '@angular/core';

import { DataService } from '../data/data.service';

@Injectable()
export class ActionsLogService {
  constructor(private dataService: DataService) {}

  log(duration: number): void {
    const data = { typeCode: 1, duration };
    this.dataService.create('/actions', {}, data).subscribe();
  }
}
