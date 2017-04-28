import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { IMenuItem, IMenuApiResponseItem, IMenuApiResponse } from './menu.interface';
import { AuthService } from '../auth/auth.service';
import { menuConfig } from '../../routes/menu-config';

const ADDITIONAL_MENU_ITEMS: Array<IMenuApiResponseItem> = [
  {
    name: 'menuItemHome'
  },
  {
    name: 'menuItemWorkflow'
  },
  {
    name: 'menuItemQueryBuilder',
  },
  {
    name: 'menuItemGrids',
    children: [
      // {
      //   name: 'menuItemLargeDataset'
      // },
      {
        name: 'menuItemSortable'
      },
      {
        name: 'menuItemReorderable'
      },
      {
        name: 'menuItemGroupable'
      }
    ]
  }
];

@Injectable()
export class MenuService {
  private menuItems: Array<IMenuItem> = [];

  constructor(private http: AuthHttp, private authService: AuthService) { }

  loadMenu() {
    const root = this.authService.root;

    return this.http
      .get('assets/server/menu.json')
      // .get(`${root}/api/menu/getMenu?path=menu`)
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

  private prepareMenuNode(node: IMenuApiResponseItem): IMenuItem {
    return {
      ...menuConfig[node.name],
      children: node.children ? node.children.map(child => this.prepareMenuNode(child)) : undefined
    };
  }
}
