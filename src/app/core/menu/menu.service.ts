import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { menu } from '../../routes/menu';
import { IMenuApiResponseItem, IMenuApiResponse } from './menu.interface';

const ADDITIONAL_MENU_ITEMS: Array<IMenuApiResponseItem> = [{
  name: 'menuItemHome'
}, {
  name: 'menuItemWorkflow'
}, {
  name: 'menuItemQueryBuilder',
}, {
  name: 'menuItemGrids',
  children: [{
    name: 'menuItemLargeDataset'
  }, {
    name: 'menuItemSortable'
  }, {
    name: 'menuItemReorderable'
  }, {
    name: 'menuItemGroupable'
  }]
}];

@Injectable()
export class MenuService {
  private menuItems: Array<IMenuApiResponseItem> = [];

  constructor(private http: AuthHttp) {
    this.menuItems = [];
  }

  loadMenu() {
    return this.http
      .get('assets/server/menu.json')
      // .get('http://localhost:8080/api/menu/getMenu?path=menu')
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
    this.menuItems = ADDITIONAL_MENU_ITEMS
      .concat(response.appGuiObjects)
      .map(item => this.prepareMenuNode(item));
  }

  private prepareMenuNode(node: IMenuApiResponseItem) {
    return {
      ...menu[node.name],
      children: node.children ? node.children.map(child => this.prepareMenuNode(child)) : undefined
    };
  }
}
