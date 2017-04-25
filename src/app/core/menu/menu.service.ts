import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IMenuItem, IMenuApiResponse } from './menu.interface';

const ADDITIONAL_MENU_ITEMS: Array<IMenuItem> = [{
  text: 'Home',
  link: '/home',
  icon: 'icon-home'
}, {
  text: 'Workflow',
  link: '/workflow',
  icon: 'icon-graph'
}, {
  text: 'Query Builder',
  link: '/query-builder',
  icon: 'icon-list'
}, {
  text: 'Grids',
  link: '/grid',
  icon: 'icon-grid',
  submenu: [{
    text: 'Large dataset',
    link: '/grid/large'
  }, {
    text: 'Sortable',
    link: '/grid/sortable'
  }, {
    text: 'Reorderable',
    link: '/grid/reorderable'
  }, {
    text: 'Groupable',
    link: '/grid/groupable'
  }]
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
        return [];
      });
  }

  getMenu() {
    return this.menuItems;
  }

  private prepareMenu(response: IMenuApiResponse) {
    this.menuItems = ADDITIONAL_MENU_ITEMS.concat(response.menu);
  }
}
