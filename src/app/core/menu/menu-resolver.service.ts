import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MenuService } from './menu.service';

@Injectable()
export class MenuResolver implements Resolve<any> {

  constructor(
    private menuService: MenuService
  ) {}

  resolve(): Observable<any> {
    return this.menuService.guiObjects;
  }
}
