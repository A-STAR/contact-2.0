import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IMenuApiResponseItem } from './menu.interface';

import { MenuService } from './menu.service';

@Injectable()
export class MenuResolver implements Resolve<Array<IMenuApiResponseItem>> {
  constructor(private menuService: MenuService) {}

  resolve(): Observable<Array<IMenuApiResponseItem>> {
    return this.menuService.guiObjects;
  }
}
