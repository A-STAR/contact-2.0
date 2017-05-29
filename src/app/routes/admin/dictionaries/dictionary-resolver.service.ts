import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IDict } from './dict/dict.interface';

import { GridService } from '../../../shared/components/grid/grid.service';

@Injectable()
export class DictionaryResolver implements Resolve<Array<IDict>> {

  constructor(
    private gridService: GridService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<IDict>> {
    return this.gridService.read('/api/dictionaries');
  }
}
