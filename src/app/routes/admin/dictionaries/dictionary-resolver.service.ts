import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IDict } from './dict/dict.interface';

import { DictService } from './dict/dict.service';
import { GridService } from '../../../shared/components/grid/grid.service';

@Injectable()
export class DictionaryResolver implements Resolve<Array<IDict>> {

  constructor(
    private dictionaryService: DictService,
    private router: Router,
    private gridService: GridService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<IDict>> {
    return this.gridService.read('/api/dictionaries');
  }
}
