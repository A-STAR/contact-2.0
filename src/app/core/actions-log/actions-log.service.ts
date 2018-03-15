import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { DataService } from '../data/data.service';

@Injectable()
export class ActionsLogService {
  constructor(private dataService: DataService) {}

  log(delay: number, guiObjectId: string): void {
    const data = { typeCode: 1, duration: delay };
    const headers = new HttpHeaders({
      'X-Gui-Object': guiObjectId
    });
    this.dataService.create('/actions', {}, data, { headers }).subscribe();
  }
}
