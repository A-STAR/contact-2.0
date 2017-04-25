import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IMenuItem, IMenuApiResponse } from './menu.interface';

const ADDITIONAL_MENU_ITEMS: Array<IMenuItem> = [{
  icon: 'icon-graph',
  text: 'Workflow',
  link: '/workflow'
}];

@Injectable()
export class MenuService {
  private menuItems: Array<IMenuItem> = [];

  constructor(private http: Http) {
    this.menuItems = [];
  }

  loadMenu() {
    return this.http
      .get('assets/server/menu.json')
      .toPromise()
      .then(response => response.json())
      .then(response => this.prepareMenu(response))
      .catch(error => {
        // TODO
        console.error('Could not load menu.', error);
      })
  }

  getMenu() {
    return this.menuItems;
  }

  private prepareMenu(response: IMenuApiResponse) {
    this.menuItems = response.menu.concat(ADDITIONAL_MENU_ITEMS);
  }
}
