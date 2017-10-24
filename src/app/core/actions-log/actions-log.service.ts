import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { DataService } from '../data/data.service';

@Injectable()
export class ActionsLogService {
  constructor(private dataService: DataService) {}

  log(name: string, delay: number, guiObjectId: string): void {
    const data = { typeCode: 1, duration: delay };
    const headers = new Headers({
      'X-Gui-Object': guiObjectId
    });
    this.dataService.create('/actions', {}, data, { headers }).subscribe();
  }
}
